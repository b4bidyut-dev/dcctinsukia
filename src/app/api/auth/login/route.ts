import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyPassword,
  createSessionToken,
  createVaultToken,
  verifyVaultToken,
  COOKIE_NAME,
  VAULT_COOKIE_NAME,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password, clientVaultToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    let activeVaultPayload: any = null;

    // Cross-Container Serverless Fallback for Vercel:
    // If the student registered on a different serverless container, SQLite /tmp/dev.db
    // might not have their row yet. We check the cryptographically signed vault token
    // from the request cookie or client request body to verify credentials and restore the row.
    if (!user) {
      const vaultToken =
        request.cookies.get(VAULT_COOKIE_NAME)?.value || clientVaultToken;

      if (vaultToken) {
        const vaultPayload = await verifyVaultToken(vaultToken);
        if (
          vaultPayload &&
          vaultPayload.email.toLowerCase().trim() === cleanEmail
        ) {
          const isVaultMatch = await verifyPassword(
            password,
            vaultPayload.passwordHash
          );

          if (isVaultMatch) {
            activeVaultPayload = vaultPayload;
            // Re-create user in the current container's SQLite database
            try {
              user = await prisma.user.upsert({
                where: { email: cleanEmail },
                update: { lastLoginAt: new Date() },
                create: {
                  id: vaultPayload.userId,
                  name: vaultPayload.name,
                  email: cleanEmail,
                  phone: vaultPayload.phone || null,
                  studentId: vaultPayload.studentId || null,
                  passwordHash: vaultPayload.passwordHash,
                  role: (vaultPayload.role as string) || "USER",
                  status: "ACTIVE",
                  lastLoginAt: new Date(),
                },
              });
            } catch (upsertErr) {
              console.warn(
                "Could not upsert user into container DB, using virtual user:",
                upsertErr
              );
              user = {
                id: vaultPayload.userId,
                name: vaultPayload.name,
                email: cleanEmail,
                role: vaultPayload.role || "USER",
                status: "ACTIVE",
                phone: vaultPayload.phone || null,
                studentId: vaultPayload.studentId || null,
                passwordHash: vaultPayload.passwordHash,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date(),
              } as any;
            }
          }
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact the administrator." },
        { status: 403 }
      );
    }

    // Verify password if not already validated via vault
    if (!activeVaultPayload) {
      const isMatch = await verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    }

    // Attempt non-fatal database updates (lastLoginAt & activity log)
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "USER_LOGIN",
          targetType: "AUTH",
          targetId: user.id,
          details: `Logged in as ${user.role}`,
          ipAddress: ip,
        },
      });
    } catch (logError) {
      console.warn("Non-fatal error updating last login / activity log:", logError);
    }

    // Create session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role as "ADMIN" | "USER",
      name: user.name,
    });

    // Create / refresh persistent vault token
    const vaultToken = await createVaultToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role as "ADMIN" | "USER",
      phone: user.phone,
      studentId: user.studentId,
    });

    const response = NextResponse.json({
      success: true,
      vaultToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });

    const isHttps =
      request.nextUrl.protocol === "https:" ||
      request.headers.get("x-forwarded-proto") === "https" ||
      process.env.NODE_ENV === "production";

    // 7-day session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // 1-year persistent vault cookie
    response.cookies.set({
      name: VAULT_COOKIE_NAME,
      value: vaultToken,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login critical error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during login. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}


