// ──────────────────────────────────────────────
// Admin Bulk Upload Page — Server Component
// Fetches students and sessions on the server,
// then renders the client form with the data.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import BulkUploadForm from "./BulkUploadForm";

export default async function BulkUploadPage() {
  // Fetch data directly from database on the server
  const [students, sessions] = await Promise.all([
    prisma.student.findMany({
      orderBy: [{ class: "asc" }, { lastName: "asc" }],
      select: {
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

  return <BulkUploadForm initialStudents={students} initialSessions={sessions} />;
}