// ──────────────────────────────────────────────
// Teacher Students Page — Server Component
// Lists students in teacher's assigned class.
// Uses shared layout (no duplicate wrapper).
// ──────────────────────────────────────────────

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTeacherFromSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  const session = await getTeacherFromSession();

  if (!session || session.role !== "TEACHER") {
    redirect("/teacher-portal/login");
  }

  const teacher = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { assignedClass: true },
  });

  const students = await prisma.student.findMany({
    where: { class: teacher?.assignedClass || "" },
    orderBy: { lastName: "asc" },
    select: {
      id: true,
      studentId: true,
      firstName: true,
      lastName: true,
      class: true,
      studentType: true,
      guardianName: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#3D1902]">👥 My Students</h1>
        <p className="text-sm text-[#8B5E3C]/70 mt-1">
          Class: {teacher?.assignedClass || "Unassigned"} • {students.length} student{students.length !== 1 ? "s" : ""}
        </p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#8B5E3C]/10 text-center">
          <p className="text-[#8B5E3C]/50">No students in your class yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="bg-[#FAF7F2] text-xs font-semibold text-[#8B5E3C] border-b border-[#8B5E3C]/10">
                  <th className="p-3 text-left">Card ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Class</th>
                  <th className="p-3 text-left hidden sm:table-cell">Type</th>
                  <th className="p-3 text-left hidden md:table-cell">Guardian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B5E3C]/5">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="p-3 font-mono text-xs text-[#8B5E3C]">{s.studentId}</td>
                    <td className="p-3 font-medium">
                      <Link
                        href={`/teacher-portal/students/${s.studentId}`}
                        className="text-[#8B5E3C] hover:text-[#3D1902] hover:underline font-bold"
                      >
                        {s.lastName} {s.firstName}
                      </Link>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#8B5E3C]/5 text-[#3D1902] rounded-full text-xs font-medium">
                        {s.class}
                      </span>
                    </td>
                    <td className="p-3 text-[#8B5E3C]/60 hidden sm:table-cell text-xs">
                      {s.studentType || "—"}
                    </td>
                    <td className="p-3 text-[#8B5E3C]/60 hidden md:table-cell">
                      {s.guardianName || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Link
        href="/teacher-portal/dashboard"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}