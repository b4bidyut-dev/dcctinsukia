import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  hashPassword,
  createSessionToken,
  createVaultToken,
  COOKIE_NAME,
  VAULT_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, studentId, password, confirmPassword } =
      await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email address, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user (Strictly default role: USER as per PRD Section 5.10)
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        studentId: studentId ? studentId.trim() : null,
        passwordHash,
        role: "USER",
        status: "ACTIVE",
        lastLoginAt: new Date(),
      },
    });

    // Log registration activity
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    await prisma.activityLog.create({
      data: {
        userId: newUser.id,
        action: "USER_REGISTER",
        targetType: "USER",
        targetId: newUser.id,
        details: `Registered account: ${newUser.email}`,
        ipAddress: ip,
      },
    });

    // Automatically create session token
    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: "USER",
      name: newUser.name,
    });

    // Generate cryptographic vault token for cross-container serverless persistence
    const vaultToken = await createVaultToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      passwordHash,
      role: "USER",
      phone: newUser.phone,
      studentId: newUser.studentId,
    });

    const response = NextResponse.json({
      success: true,
      message: "Registration successful! Welcome to DCC Tinsukia Notes Portal.",
      vaultToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
      },
    });

    const isHttps =
      request.nextUrl.protocol === "https:" ||
      request.headers.get("x-forwarded-proto") === "https" ||
      process.env.NODE_ENV === "production";

    // Set 7-day session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Set 1-year persistent vault cookie
    response.cookies.set({
      name: VAULT_COOKIE_NAME,
      value: vaultToken,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year persistence
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please check your details and try again." },
      { status: 500 }
    );
  }
}

