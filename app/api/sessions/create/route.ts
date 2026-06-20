// app/api/sessions/create/route.ts
// ──────────────────────────────────────────────
// Create Session API — Admin Only
// ──────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminFromSession();

    if (!adminSession || adminSession.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { year, term, isActive } = await req.json();

    if (!year || !term) {
      return NextResponse.json({ error: "Year and term are required" }, { status: 400 });
    }

    const validTerms = ["FIRST", "SECOND", "THIRD"];
    const normalizedTerm = term.toUpperCase().trim();

    if (!validTerms.includes(normalizedTerm)) {
      return NextResponse.json(
        { error: "Term must be FIRST, SECOND, or THIRD" },
        { status: 400 }
      );
    }

    // Deactivate all others if this one is active
    if (isActive) {
      await prisma.academicSession.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const session = await prisma.academicSession.create({
      data: {
        year: year.trim(),
        term: normalizedTerm as any,
        isActive: !!isActive,
      } as any,
    });

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        year: session.year,
        term: session.term,
        isActive: session.isActive,
      },
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}