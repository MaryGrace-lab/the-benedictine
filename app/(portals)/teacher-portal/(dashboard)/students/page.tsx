// ──────────────────────────────────────────────
// Teacher Students Page — Server Component
// Lists students in teacher's assigned class.
// Click name to view student profile.
// ──────────────────────────────────────────────

import Link from "next/link";
import LogoutButton from "@/components/ui/LogoutButton";
import { prisma } from "@/lib/prisma";
import { getTeacherFromSession } from "@/lib/jwt";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3D1902]">👥 My Students</h1>
            <p className="text-sm text-[#8B5E3C]/70">
              Class: {teacher?.assignedClass} • {students.length} students
            </p>
          </div>
          <LogoutButton type="teacher" />
        </div>

        {students.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border text-center">
            <p className="text-[#8B5E3C]">No students in your class yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF7F2] text-xs font-semibold text-[#8B5E3C] border-b">
                  <th className="p-3 text-left">Card ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Class</th>
                  <th className="p-3 text-left hidden md:table-cell">Guardian</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAF7F2]/50">
                    <td className="p-3 font-mono text-xs text-[#8B5E3C]">{s.studentId}</td>
                    <td className="p-3 font-medium">
                      <Link
                        href={`/teacher-portal/students/${s.studentId}`}
                        className="text-[#8B5E3C] hover:text-[#3D1902] hover:underline font-bold"
                      >
                        {s.lastName} {s.firstName}
                      </Link>
                    </td>
                    <td className="p-3 text-[#3D1902]">{s.class}</td>
                    <td className="p-3 text-[#8B5E3C]/60 hidden md:table-cell">
                      {s.guardianName || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link
          href="/teacher-portal/dashboard"
          className="block w-full mt-4 py-3 text-center text-sm font-medium text-[#8B5E3C] hover:text-[#3D1902]"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}