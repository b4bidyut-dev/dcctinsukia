import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

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

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
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

    const response = NextResponse.json({
      success: true,
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

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
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


