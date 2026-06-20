// app/api/sessions/route.ts
// ──────────────────────────────────────────────
// Sessions List API — Authenticated Users
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession, getTeacherFromSession, getStudentFromSession } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    // Auth: Any logged-in user
    const admin = await getAdminFromSession();
    const teacher = await getTeacherFromSession();
    const student = await getStudentFromSession();

    if (!admin && !teacher && !student) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const withCounts = searchParams.get("withCounts") === "true";

    const sessions = await prisma.academicSession.findMany({
      orderBy: { createdAt: "desc" },
      ...(withCounts
        ? { include: { _count: { select: { results: true } } } }
        : {}),
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}