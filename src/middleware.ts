import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dcc_tinsukia_notes_portal_super_secret_jwt_key_2026_secured"
);

const COOKIE_NAME = "dcc_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths requiring authentication
  const isAdminPath = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isProtectedUserPath =
    pathname.startsWith("/library") ||
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/notes") && !pathname.startsWith("/notes/public"));

  if (!isAdminPath && !isProtectedUserPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminPath) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    } else {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    // Check Admin access
    if (isAdminPath && role !== "ADMIN") {
      const url = new URL("/library", request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid or expired token
    const redirectUrl = isAdminPath ? "/admin/login" : "/login";
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/library/:path*",
    "/dashboard/:path*",
    "/notes/:path*",
  ],
};

