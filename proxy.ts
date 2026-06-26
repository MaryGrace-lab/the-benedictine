// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

type TokenPayload = {
  userId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  assignedClass?: string | null;
};

async function getPayloadFromToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─────────────────────────────────────────────
  // 1. ADMIN PORTAL PROTECTION
  // ─────────────────────────────────────────────
  if (
    pathname.startsWith("/admin-portal") &&
    !pathname.startsWith("/admin-portal/login")
  ) {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/admin-portal/login", request.url)
      );
    }

    const payload = await getPayloadFromToken(token);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin-portal/login", request.url)
      );
    }
  }

  // ─────────────────────────────────────────────
  // 2. TEACHER PORTAL PROTECTION
  // ─────────────────────────────────────────────
  if (
    pathname.startsWith("/teacher-portal") &&
    !pathname.startsWith("/teacher-portal/login")
  ) {
    const token = request.cookies.get("teacher-token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/teacher-portal/login", request.url)
      );
    }

    const payload = await getPayloadFromToken(token);

    if (!payload || payload.role !== "TEACHER") {
      return NextResponse.redirect(
        new URL("/teacher-portal/login", request.url)
      );
    }
  }

  // ─────────────────────────────────────────────
  // 3. STUDENT PORTAL PROTECTION
  // ─────────────────────────────────────────────
  if (
    pathname.startsWith("/student-portal") &&
    !pathname.startsWith("/student-portal/login")
  ) {
    const token = request.cookies.get("student-token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/student-portal/login", request.url)
      );
    }

    const payload = await getPayloadFromToken(token);

    if (!payload || payload.role !== "STUDENT") {
      return NextResponse.redirect(
        new URL("/student-portal/login", request.url)
      );
    }
  }

  // ─────────────────────────────────────────────
  // 4. API PROTECTION
  // ─────────────────────────────────────────────
  if (
    pathname.startsWith("/api/students") ||
    pathname.startsWith("/api/results") ||
    pathname.startsWith("/api/sessions")
  ) {
    const token =
      request.cookies.get("admin-token")?.value ||
      request.cookies.get("teacher-token")?.value ||
      request.cookies.get("student-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await getPayloadFromToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Students API
    if (pathname.startsWith("/api/students")) {
      if (
        payload.role !== "ADMIN" &&
        payload.role !== "TEACHER"
      ) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    // Results API
    if (pathname.startsWith("/api/results")) {
      if (
        payload.role !== "ADMIN" &&
        payload.role !== "TEACHER"
      ) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    // Sessions API
    if (pathname.startsWith("/api/sessions")) {
      if (payload.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-portal/:path*",
    "/teacher-portal/:path*",
    "/student-portal/:path*",
    "/api/students/:path*",
    "/api/results/:path*",
    "/api/sessions/:path*",
    "/api/auth/change-password",
    "/api/auth/student-logout",
    "/api/auth/admin-logout",
    "/api/auth/teacher-logout",
  ],
};