// ──────────────────────────────────────────────
// Edit Results Page — Server Component
// Fetches students and sessions on the server,
// then renders the client form with the data.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import EditResultsForm from "./EditResultsForm";

export default async function EditResultsPage() {
  // Fetch data directly from database on the server
  const [students, sessions] = await Promise.all([
    prisma.student.findMany({
      orderBy: [{ class: "asc" }, { lastName: "asc" }],
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        class: true,
        studentType: true as const,
      },
    }),
    prisma.academicSession.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, year: true, term: true },
    }),
  ]);

  return <EditResultsForm initialStudents={students} initialSessions={sessions} />;
}