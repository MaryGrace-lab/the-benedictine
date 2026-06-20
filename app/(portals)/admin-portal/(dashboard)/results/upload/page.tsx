// ──────────────────────────────────────────────
// Admin Upload Page — Server Component
// Fetches students and sessions on the server,
// then renders the client form with the data.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import UploadResultsForm from "./UploadResultsForm";

export default async function UploadResultsPage() {
  const [students, sessions] = await Promise.all([
    prisma.student.findMany({
      orderBy: [{ class: "asc" }, { lastName: "asc" }],
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

  return <UploadResultsForm initialStudents={students} initialSessions={sessions} />;
}