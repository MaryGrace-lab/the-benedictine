// ──────────────────────────────────────────────
// Teacher Student Profile Page — Server Component
// Shows student details and result history.
// Uses a catch-all route to support IDs with slashes.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { getTeacherFromSession } from "@/lib/jwt";
import { redirect, notFound } from "next/navigation";
import TeacherStudentProfileClient from "./TeacherStudentProfileClient";

interface Props {
  params: Promise<{ studentId: string[] }>;
}

export const dynamic = "force-dynamic";

export default async function TeacherStudentProfilePage({ params }: Props) {
  const session = await getTeacherFromSession();
  const { studentId: parts } = await params;
  const studentId = Array.isArray(parts) ? parts.join("/") : parts;

  if (!session || session.role !== "TEACHER") {
    redirect("/teacher-portal/login");
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

  if (!student) notFound();

  // Verify teacher is assigned to this student's class
  const teacher = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { assignedClass: true },
  });

  if (student.class !== teacher?.assignedClass) {
    redirect("/teacher-portal/students");
  }

  // Get result history
  const resultHistory = await prisma.resultSummary.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    include: {
      session: { select: { year: true, term: true, isActive: true } },
    },
  });

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
  }));

  const bestPerformance = history.length > 0
    ? Math.max(...history.map((h) => h.percentageAvg || 0))
    : 0;

  return (
    <TeacherStudentProfileClient
      student={student}
      history={history}
      bestPerformance={bestPerformance}
      totalSessions={history.length}
    />
  );
}