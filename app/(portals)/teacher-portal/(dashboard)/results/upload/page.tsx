// ──────────────────────────────────────────────
// Teacher Upload Page — Server Component
// Fetches students and sessions on the server.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { getTeacherFromSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import TeacherUploadClient from "./TeacherUploadClient";

export default async function TeacherUploadPage() {
  const session = await getTeacherFromSession();

  if (!session || session.role !== "TEACHER") {
    redirect("/teacher-portal/login");
  }

  const [students, sessions] = await Promise.all([
    prisma.student.findMany({
      where: { class: session.assignedClass || "" },
      orderBy: { lastName: "asc" },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        class: true,
        studentType: true,
      },
    }),
    prisma.academicSession.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, year: true, term: true },
    }),
  ]);

  return <TeacherUploadClient initialStudents={students} initialSessions={sessions} />;
}