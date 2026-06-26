// ──────────────────────────────────────────────
// Student Dashboard — Server Component
// Shows profile summary and quick actions.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { getStudentFromSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import StudentDashboardClient from "./StudentDashboardClient";

export const dynamic = "force-dynamic";
export default async function StudentDashboardPage() {
  const sessionStudentId = await getStudentFromSession();

  if (!sessionStudentId) {
    redirect("/student-portal/login");
  }

  const student = await prisma.student.findUnique({
    where: { studentId: sessionStudentId },
    select: {
      firstName: true,
      lastName: true,
      class: true,
      studentId: true,
      studentType: true,
    },
  });

  if (!student) {
    redirect("/student-portal/login");
  }

  // Get latest result summary
  const activeSession = await prisma.academicSession.findFirst({
    where: { isActive: true },
  });

  let latestResult: { percentageAvg: number | null; remark: string | null; totalScore: number | null; totalCumulative: number | null } | null = null;
if (activeSession) {
  const studentRecord = await prisma.student.findUnique({
    where: { studentId: sessionStudentId },
    select: { id: true },
  });

  if (studentRecord) {
    latestResult = await prisma.resultSummary.findUnique({
      where: {
        studentId_sessionId: {
          studentId: studentRecord.id,
          sessionId: activeSession.id,
        },
      },
      select: {
        percentageAvg: true,
        remark: true,
        totalScore: true,
        totalCumulative: true,
      },
    });
  }
}

  // Count total sessions with results
  const studentDb = await prisma.student.findUnique({
    where: { studentId: sessionStudentId },
    select: { id: true },
  });

  const totalSessions = await prisma.resultSummary.count({
    where: { studentId: studentDb?.id },
  });

  return (
    <StudentDashboardClient
      student={student}
      latestResult={latestResult}
      totalSessions={totalSessions}
      hasActiveResult={!!latestResult}
    />
  );
}