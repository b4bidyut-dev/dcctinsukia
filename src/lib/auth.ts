import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dcc_tinsukia_notes_portal_super_secret_jwt_key_2026_secured"
);

export const COOKIE_NAME = "dcc_session";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "USER";
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<{
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string | null;
  studentId?: string | null;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          phone: true,
          studentId: true,
        },
      });

      if (user) {
        if (user.status !== "ACTIVE") {
          return null;
        }
        return user;
      }
    } catch (dbErr) {
      console.warn("DB lookup in getCurrentUser failed, using signed JWT payload fallback:", dbErr);
    }

    // FALLBACK TO VERIFIED JWT PAYLOAD:
    // The session token is cryptographically signed by the server with JWT_SECRET.
    // This guarantees the user stays logged in across all serverless lambda containers,
    // avoiding the issue where an ephemeral container doesn't have the newly registered student yet!
    return {
      id: payload.userId,
      name: payload.name || "Student",
      email: payload.email,
      role: (payload.role as string) || "USER",
      status: "ACTIVE",
      phone: null,
      studentId: null,
    };
  } catch (error: any) {
    if (error?.digest?.startsWith("DYNAMIC_") || error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Error retrieving current user:", error);
    return null;
  }
}

