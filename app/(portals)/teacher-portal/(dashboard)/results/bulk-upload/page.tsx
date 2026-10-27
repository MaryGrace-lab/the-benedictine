// ──────────────────────────────────────────────
// Teacher Bulk Upload Page — Server Component
// Fetches students and sessions on the server.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { getTeacherFromSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import TeacherBulkUploadClient from "./TeacherBulkUploadClient";

export const dynamic = "force-dynamic";
export default async function TeacherBulkUploadPage() {
  const session = await getTeacherFromSession();

  if (!session || session.role !== "TEACHER") {
    redirect("/teacher-portal/login");
  }

  const students = await prisma.student.findMany({
    where: { class: session.assignedClass || "" },
    orderBy: { lastName: "asc" },
    select: {
      studentId: true,
      firstName: true,
      lastName: true,
      class: true,
      studentType: true,
    },
  });

  const sessions = await prisma.academicSession.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, year: true, term: true },
  });

  return <TeacherBulkUploadClient initialStudents={students} initialSessions={sessions} />;
}