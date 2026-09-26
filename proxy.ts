// proxy.ts — Route Protection, Rate Limiting & API Authorization
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Initialize Upstash Redis for rate limiting
const redis = Redis.fromEnv();

const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    process.env.NODE_ENV === "production" ? 5 : 20,
    "15 m"
  ),
  analytics: true,
  prefix: "ratelimit:auth",
});

const publicRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "ratelimit:public",
});

const chatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ratelimit:chat",
});

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
  const ip = request.headers.get("x-forwarded-for") ?? 
             request.headers.get("x-real-ip") ?? 
             "anonymous";

  // ─────────────────────────────────────────────
  // PORTAL ROUTE PROTECTION
  // ─────────────────────────────────────────────

  // ── ADMIN PORTAL ──
  if (
    pathname.startsWith("/admin-portal") &&
    !pathname.startsWith("/admin-portal/login")
  ) {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin-portal/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await getPayloadFromToken(token);

    if (!payload || payload.role !== "ADMIN") {
      const response = NextResponse.redirect(
        new URL("/admin-portal/login", request.url)
      );
      response.cookies.delete("admin-token");
      return response;
    }
  }

  // ── TEACHER PORTAL ──
  if (
    pathname.startsWith("/teacher-portal") &&
    !pathname.startsWith("/teacher-portal/login")
  ) {
    const token = request.cookies.get("teacher-token")?.value;

    if (!token) {
      const loginUrl = new URL("/teacher-portal/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await getPayloadFromToken(token);

    if (!payload || payload.role !== "TEACHER") {
      const response = NextResponse.redirect(
        new URL("/teacher-portal/login", request.url)
      );
      response.cookies.delete("teacher-token");
      return response;
    }
  }

  // ── STUDENT PORTAL ──
  if (
    pathname.startsWith("/student-portal") &&
    !pathname.startsWith("/student-portal/login")
  ) {
    const token = request.cookies.get("student-token")?.value;

    if (!token) {
      const loginUrl = new URL("/student-portal/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await getPayloadFromToken(token);

    if (!payload || payload.role !== "STUDENT") {
      const response = NextResponse.redirect(
        new URL("/student-portal/login", request.url)
      );
      response.cookies.delete("student-token");
      return response;
    }
  }

  // ─────────────────────────────────────────────
  // API ROUTE PROTECTION
  // ─────────────────────────────────────────────
  
  if (pathname.startsWith("/api/")) {
    
    // ── AUTH ENDPOINTS (Public but rate-limited) ──
    if (
      pathname.startsWith("/api/auth/") && 
      request.method === "POST"
    ) {
      let rateLimitResult;
      try {
        rateLimitResult = await authRatelimit.limit(ip);
      } catch (error) {
        console.error("Auth rate limiter unavailable:", error);
        return NextResponse.json(
          { error: "Authentication temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }

      const { success, limit, reset, remaining } = rateLimitResult;

      if (!success) {
        return NextResponse.json(
          { error: "Too many attempts. Please try again later." },
          { 
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(reset),
            }
          }
        );
      }

      return NextResponse.next();
    }

    // ── CHAT ENDPOINT (Public, higher rate limit) ──
    if (pathname === "/api/chat" && request.method === "POST") {
      let rateLimitResult;
      try {
        rateLimitResult = await chatRatelimit.limit(ip);
      } catch (error) {
        console.error("Chat rate limiter unavailable:", error);
        return NextResponse.json(
          { error: "Chat temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }

      const { success, limit, reset, remaining } = rateLimitResult;

      if (!success) {
        return NextResponse.json(
          { error: "You are sending too many messages. Please wait a moment." },
          { 
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
            }
          }
        );
      }

      return NextResponse.next();
    }

    // ── PUBLIC ENDPOINTS ──
    const publicEndpoints = [
      "/api/contact",
      "/api/admission/submit",
      "/api/admission/applications",
      "/api/admission/upload",
      "/api/chat",
    ];

    if (publicEndpoints.some((endpoint) => pathname.startsWith(endpoint))) {
      if (request.method === "POST") {
        let rateLimitResult;
        try {
          rateLimitResult = await publicRatelimit.limit(ip);
        } catch (error) {
          console.error("Public rate limiter unavailable:", error);
          return NextResponse.json(
            { error: "Service temporarily unavailable. Please try again later." },
            { status: 503 }
          );
        }

        const { success, reset } = rateLimitResult;

        if (!success) {
          return NextResponse.json(
            { error: "Too many submissions. Please try again later." },
            { 
              status: 429,
              headers: {
                "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
              }
            }
          );
        }
      }
      
      return NextResponse.next();
    }

    // ── PROTECTED ENDPOINTS ──
    const token =
      request.cookies.get("admin-token")?.value ||
      request.cookies.get("teacher-token")?.value ||
      request.cookies.get("student-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = await getPayloadFromToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please login again." },
        { status: 401 }
      );
    }

    // Admin-only endpoints
    const adminOnlyPaths = [
      "/api/teachers",
      "/api/sessions",
      "/api/students/create",
      "/api/students/delete",
      "/api/students/edit",
      "/api/students/password",
    ];

    if (adminOnlyPaths.some((path) => pathname.startsWith(path))) {
      if (payload.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    }

    // Results API
    if (pathname.startsWith("/api/results")) {
      if (payload.role !== "ADMIN" && payload.role !== "TEACHER") {
        return NextResponse.json(
          { error: "Teacher or Admin access required" },
          { status: 403 }
        );
      }
    }

    // Students list API
    if (
      pathname.startsWith("/api/students") && 
      request.method === "GET" && 
      !pathname.startsWith("/api/students/profile")
    ) {
      if (payload.role !== "ADMIN" && payload.role !== "TEACHER") {
        return NextResponse.json(
          { error: "Teacher or Admin access required" },
          { status: 403 }
        );
      }
    }
  }

  // ─────────────────────────────────────────────
  // SECURITY HEADERS
  // ─────────────────────────────────────────────
  
  const response = NextResponse.next();
  
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    "/admin-portal/:path*",
    "/teacher-portal/:path*",
    "/student-portal/:path*",
    "/api/:path*",
  ],
};