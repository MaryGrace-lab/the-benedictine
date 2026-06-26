// ──────────────────────────────────────────────
// View Students Page — Server Component
// Fetches students on the server via Prisma.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import ViewStudentsClient from "./ViewStudentsClient";

export const dynamic = "force-dynamic";
export default async function ViewStudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: [{ class: "asc" }, { lastName: "asc" }],
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

  return <ViewStudentsClient initialStudents={students} />;
}