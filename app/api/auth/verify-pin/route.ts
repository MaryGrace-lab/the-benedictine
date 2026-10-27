// app/api/auth/verify-pin/route.ts
// Verify Student PIN — Rate-limited to 3 attempts per 15 minutes per student.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentFromSession, setResultsUnlockSession } from "@/lib/jwt";
import { verifyStudentPin } from "@/lib/auth";
import { pinRatelimit } from "@/lib/pin-ratelimit";

export async function POST(req: Request) {
  try {
    const studentId = await getStudentFromSession();
    if (!studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // ── Rate limit: 3 attempts per 15 minutes per student ──
    let rateLimitResult;
    try {
      rateLimitResult = await pinRatelimit.limit(studentId);
    } catch (error) {
      console.error("PIN rate limiter unavailable:", error);
      return NextResponse.json(
        { error: "Verification temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const { success, limit, remaining, reset } = rateLimitResult;

    if (!success) {
      const minutesLeft = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 60000)
      );
      return NextResponse.json(
        {
          error: `Too many incorrect attempts. Please try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          },
        }
      );
    }

    const { pin } = await req.json();
    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
      select: { id: true, pin: true },
    });

    if (!student || !student.pin) {
      return NextResponse.json(
        { error: "No PIN configured. Please contact the school office." },
        { status: 404 }
      );
    }

    const valid = await verifyStudentPin(pin.trim(), student.pin);
    if (!valid) {
      return NextResponse.json(
        {
          error: "Incorrect PIN",
          attemptsRemaining: remaining - 1,
        },
        { status: 401 }
      );
    }

    await setResultsUnlockSession(studentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PIN verification error:", error);
    return NextResponse.json({ error: "Failed to verify PIN" }, { status: 500 });
  }
}