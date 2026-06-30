// ──────────────────────────────────────────────
// View Students Page — Server Component
// Fetches students on the server via Prisma.
// Uses Suspense for loading state.
// ──────────────────────────────────────────────

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ViewStudentsClient from "./ViewStudentsClient";

export const dynamic = "force-dynamic";

function StudentsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
          <div className="h-12 bg-slate-200 rounded-xl"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

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

  return (
    <Suspense fallback={<StudentsLoading />}>
      <ViewStudentsClient initialStudents={students} />
    </Suspense>
  );
}