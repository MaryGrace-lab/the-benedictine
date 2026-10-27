// ──────────────────────────────────────────────
// Edit Results Page — Server Component
// Fetches students and sessions on the server,
// then renders the client form with the data.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import EditResultsForm from "./EditResultsForm";

export const dynamic = "force-dynamic";
export default async function EditResultsPage() {
  // Fetch sequentially to prevent connection pool exhaustion
  const students = await prisma.student.findMany({
    orderBy: [{ class: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      studentId: true,
      firstName: true,
      lastName: true,
      class: true,
      studentType: true as const,
    },
  });

  const sessions = await prisma.academicSession.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, year: true, term: true },
  });

  return <EditResultsForm initialStudents={students} initialSessions={sessions} />;
}