// app/(portals)/admin-portal/(dashboard)/dashboard/page.tsx

import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export default async function AdminDashboardPage() {
  // Fetch data sequentially to avoid connection‑pool exhaustion.
  // Each call uses one connection and frees it before the next begins.
  const totalStudents = await prisma.student.count();
  const totalResults = await prisma.result.count();
  const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });

  const activeSession = await prisma.academicSession.findFirst({
    where: { isActive: true },
    select: { year: true, term: true },
  });

  const studentsByClass = await prisma.student.groupBy({
    by: ["class"],
    _count: { id: true },
    orderBy: { class: "asc" },
  });

  const recentStudents = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
    select: { firstName: true, lastName: true, class: true, studentId: true, createdAt: true },
  });

  const recentResults = await prisma.resultSummary.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
    select: {
      percentageAvg: true, remark: true, createdAt: true,
      student: { select: { firstName: true, lastName: true } },
      session: { select: { year: true, term: true } },
    },
  });

  // Pass icon NAMES as strings, not components
  const stats = [
    { label: "Total Students", value: totalStudents, icon: "Users" },
    { label: "Teachers", value: totalTeachers, icon: "GraduationCap" },
    { label: "Results Uploaded", value: totalResults, icon: "ClipboardList" },
    { label: "Active Term", value: activeSession?.term || "—", icon: "BarChart3" },
  ];

  const chartData = studentsByClass.map((item) => ({
    name: item.class,
    students: item._count.id,
  }));

  return (
    <DashboardClient
      stats={stats}
      chartData={chartData}
      activeSession={activeSession}
      recentStudents={recentStudents}
      recentResults={recentResults}
    />
  );
}