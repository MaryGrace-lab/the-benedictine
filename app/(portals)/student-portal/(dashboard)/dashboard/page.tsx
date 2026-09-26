// ──────────────────────────────────────────────
// Student Dashboard — Server Component
// Shows profile summary, quick actions, notifications.
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

  // Get active session
  const activeSession = await prisma.academicSession.findFirst({
    where: { isActive: true },
    select: { id: true, year: true, term: true },
  });

  // Get the student's DB id (needed for relations)
  const studentRecord = await prisma.student.findUnique({
    where: { studentId: sessionStudentId },
    select: { id: true },
  });

  let latestResult: {
    percentageAvg: number | null;
    remark: string | null;
    totalScore: number | null;
    totalCumulative: number | null;
  } | null = null;

  if (activeSession && studentRecord) {
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

  const totalSessions = await prisma.resultSummary.count({
    where: { studentId: studentRecord?.id },
  });

  // Fetch recent result summaries for notifications
  const resultSummaries = studentRecord
    ? await prisma.resultSummary.findMany({
        where: { studentId: studentRecord.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          session: { select: { year: true, term: true } },
        },
      })
    : [];

  const notifications = resultSummaries.map((r) => {
    const created = r.createdAt.getTime();
    const updated = r.updatedAt.getTime();
    // If updated more than 5 minutes after creation, treat as an update
    const isUpdate = updated - created > 5 * 60 * 1000;
    return {
      id: r.id,
      type: isUpdate ? ("updated" as const) : ("new" as const),
      sessionLabel: `${r.session.year} ${r.session.term} Term`,
      timestamp: r.updatedAt.toISOString(),
    };
  });

  return (
    <StudentDashboardClient
      student={student}
      latestResult={latestResult}
      totalSessions={totalSessions}
      hasActiveResult={!!latestResult}
      notifications={notifications}
    />
  );
}