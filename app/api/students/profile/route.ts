// app/api/students/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession, getTeacherFromSession } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const adminSession = await getAdminFromSession();
    const teacherSession = await getTeacherFromSession();

    if (!adminSession && !teacherSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        class: true,
        studentType: true,
        guardianName: true,
        guardianPhone: true,
        createdAt: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get all result summaries across all sessions
    const resultHistory = await prisma.resultSummary.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      include: {
        session: { select: { year: true, term: true, isActive: true } },
      },
    });

    // Get total subjects per session
    const sessionIds = resultHistory.map((r) => r.sessionId);
    const resultCounts = await prisma.result.groupBy({
      by: ["sessionId"],
      where: { studentId: student.id, sessionId: { in: sessionIds } },
      _count: { id: true },
    });

    const countsMap: Record<string, number> = {};
    resultCounts.forEach((r) => {
      countsMap[r.sessionId] = r._count.id;
    });

    const history = resultHistory.map((r) => ({
      session: r.session,
      totalCumulative: r.totalCumulative,
      totalScore: r.totalScore,
      percentageAvg: r.percentageAvg,
      grade: r.percentageAvg
        ? r.percentageAvg >= 90
          ? "A"
          : r.percentageAvg >= 70
          ? "B"
          : r.percentageAvg >= 50
          ? "C"
          : "F"
        : null,
      remark: r.remark,
      subjects: countsMap[r.sessionId] || 0,
    }));

    return NextResponse.json({
      student,
      history,
      totalSessions: history.length,
      bestPerformance: history.length > 0
        ? Math.max(...history.map((h) => h.percentageAvg || 0))
        : 0,
      latestPerformance: history.length > 0 ? history[0].percentageAvg : null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}