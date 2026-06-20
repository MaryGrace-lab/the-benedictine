// app/api/results/sessions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentFromSession } from "@/lib/jwt";

export async function GET() {
  try {
    const studentId = await getStudentFromSession();

    if (!studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessions = await prisma.academicSession.findMany({
      where: {
        resultSummaries: {
          some: {
            student: { studentId },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        year: true,
        term: true,
        isActive: true,
      },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}