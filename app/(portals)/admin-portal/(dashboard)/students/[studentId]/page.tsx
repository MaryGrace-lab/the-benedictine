// ──────────────────────────────────────────────
// Student Profile Page — Server Component
// Fetches student details and result history.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StudentProfileClient from "./StudentProfileClient";

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function StudentProfilePage({ params }: Props) {
  const { studentId } = await params;

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

  if (!student) notFound();

  const resultHistory = await prisma.resultSummary.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    include: {
      session: { select: { year: true, term: true, isActive: true } },
    },
  });

  const sessionIds: string[] = resultHistory.map((r: { sessionId: string }) => r.sessionId);
  
  const resultCounts = await prisma.result.groupBy({
    by: ["sessionId"],
    where: { studentId: student.id, sessionId: { in: sessionIds } },
    _count: { id: true },
  });

  const countsMap: Record<string, number> = {};
  resultCounts.forEach((r: { sessionId: string; _count: { id: number } }) => {
    countsMap[r.sessionId] = r._count.id;
  });

  const history = resultHistory.map((r) => ({
    id: r.id,
    session: r.session,
    totalCumulative: r.totalCumulative,
    totalScore: r.totalScore,
    percentageAvg: r.percentageAvg,
    grade: r.percentageAvg
      ? r.percentageAvg >= 90 ? "A" : r.percentageAvg >= 70 ? "B" : r.percentageAvg >= 50 ? "C" : "F"
      : null,
    remark: r.remark,
    subjects: countsMap[r.sessionId] || 0,
    classTeacherComment: r.classTeacherComment,
  }));

  const bestPerformance = history.length > 0
    ? Math.max(...history.map((h: { percentageAvg: number | null }) => h.percentageAvg || 0))
    : 0;

  const latestPerformance = history.length > 0 ? history[0].percentageAvg : null;

  return (
    <StudentProfileClient
      student={student}
      history={history}
      bestPerformance={bestPerformance}
      latestPerformance={latestPerformance}
      totalSessions={history.length}
    />
  );
}