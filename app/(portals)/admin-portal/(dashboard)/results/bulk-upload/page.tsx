// ──────────────────────────────────────────────
// Admin Bulk Upload Page — Server Component
// Fetches students and sessions on the server,
// then renders the client form with the data.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import BulkUploadForm from "./BulkUploadForm";

export const dynamic = "force-dynamic";
export default async function BulkUploadPage() {
  // Fetch sequentially to avoid connection‑pool exhaustion
  const students = await prisma.student.findMany({
    orderBy: [{ class: "asc" }, { lastName: "asc" }],
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

  return <BulkUploadForm initialStudents={students} initialSessions={sessions} />;
}