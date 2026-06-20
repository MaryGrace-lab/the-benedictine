// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function getPayloadFromToken(token: string): Promise<{ userId: string; role: string; assignedClass?: string | null } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; assignedClass?: string | null };
  } catch {
    return null;
  }
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. API Route Protection ──
  if (
    pathname.startsWith("/api/students") ||
    pathname.startsWith("/api/sessions") ||
    pathname.startsWith("/api/results")
  ) {
    if (
      pathname.startsWith("/api/auth/student-login") ||
      pathname.startsWith("/api/auth/admin-login") ||
      pathname.startsWith("/api/auth/teacher-login") ||
      pathname.startsWith("/api/auth/forgot-password")
    ) {
      return NextResponse.next();
    }

    if (request.method === "GET") {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get("admin-token")?.value;
    const teacherToken = request.cookies.get("teacher-token")?.value;
    const studentToken = request.cookies.get("student-token")?.value;
    const token = adminToken || teacherToken || studentToken;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ── 2. Admin Portal Rules ──
  if (pathname.startsWith("/admin-portal") && !pathname.startsWith("/admin-portal/login")) {
    const adminToken = request.cookies.get("admin-token")?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin-portal/login", request.url));
    }

    const decrypted = await getPayloadFromToken(adminToken);
    if (!decrypted || decrypted.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin-portal/login", request.url));
    }
  }

  // ── 3. Teacher Portal Rules ──
  if (pathname.startsWith("/teacher-portal") && !pathname.startsWith("/teacher-portal/login")) {
    const teacherToken = request.cookies.get("teacher-token")?.value;

    if (!teacherToken) {
      return NextResponse.redirect(new URL("/teacher-portal/login", request.url));
    }

    const decrypted = await getPayloadFromToken(teacherToken);
    if (!decrypted || decrypted.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/teacher-portal/login", request.url));
    }
  }

  // ── 4. Student Portal Rules ──
  if (pathname.startsWith("/student-portal") && !pathname.startsWith("/student-portal/login")) {
    const studentToken = request.cookies.get("student-token")?.value;

    if (!studentToken) {
      return NextResponse.redirect(new URL("/student-portal/login", request.url));
    }

    if (!(await verifyToken(studentToken))) {
      return NextResponse.redirect(new URL("/student-portal/login", request.url));
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
    "/api/sessions/:path*",
    "/api/results/:path*",
    "/api/auth/change-password",
    "/api/auth/student-logout",
    "/api/auth/admin-logout",
    "/api/auth/teacher-logout",
  ],
};