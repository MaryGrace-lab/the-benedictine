// ──────────────────────────────────────────────
// Teacher Dashboard — Server Component
// Shows class stats, quick actions, recent students.
// Uses shared layout (no duplicate header/logo).
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { getTeacherFromSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Upload, FileSpreadsheet, Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const session = await getTeacherFromSession();

  // Auth guard
  if (!session || session.role !== "TEACHER") {
    redirect("/teacher-portal/login");
  }

  // Fetch teacher profile + stats in parallel
  const [teacher, studentCount, resultCount, recentStudents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, assignedClass: true },
    }),
    prisma.student.count({
      where: { class: session.assignedClass || "" },
    }),
    prisma.result.count({
      where: { student: { class: session.assignedClass || "" } },
    }),
    prisma.student.findMany({
      where: { class: session.assignedClass || "" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        firstName: true,
        lastName: true,
        studentId: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#3D1902]">Teacher Dashboard</h1>
        <p className="text-sm text-[#8B5E3C]/70 mt-1">
          Welcome back, {teacher?.name || "Teacher"} —{" "}
          {teacher?.assignedClass ? (
            <span className="font-semibold">{teacher.assignedClass}</span>
          ) : (
            <span className="text-red-500">No class assigned</span>
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center mb-3">
            <Users size={20} />
          </div>
          <p className="text-3xl font-bold text-[#8B5E3C]">{studentCount}</p>
          <p className="text-sm text-[#8B5E3C]/50 mt-1">
            Students in {teacher?.assignedClass || "your class"}
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center mb-3">
            <Upload size={20} />
          </div>
          <p className="text-3xl font-bold text-[#8B5E3C]">{resultCount}</p>
          <p className="text-sm text-[#8B5E3C]/50 mt-1">Results Uploaded</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#3D1902] mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/teacher-portal/results/upload"
            className="bg-white p-5 sm:p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <Upload size={28} className="text-[#8B5E3C] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[#3D1902] group-hover:text-[#8B5E3C] transition-colors">
              📝 Upload Results
            </h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">
              Enter scores for individual students
            </p>
          </Link>

          <Link
            href="/teacher-portal/results/bulk-upload"
            className="bg-white p-5 sm:p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <FileSpreadsheet size={28} className="text-[#8B5E3C] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[#3D1902] group-hover:text-[#8B5E3C] transition-colors">
              📊 Bulk Upload
            </h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">
              Upload results for entire class at once
            </p>
          </Link>

          <Link
            href="/teacher-portal/students"
            className="bg-white p-5 sm:p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <Users size={28} className="text-[#8B5E3C] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[#3D1902] group-hover:text-[#8B5E3C] transition-colors">
              👥 My Students
            </h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">
              View students in {teacher?.assignedClass || "your class"}
            </p>
          </Link>

          <Link
            href="/teacher-portal/settings"
            className="bg-white p-5 sm:p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <Settings size={28} className="text-[#8B5E3C] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-[#3D1902] group-hover:text-[#8B5E3C] transition-colors">
              ⚙️ Settings
            </h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">
              Change password and preferences
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#3D1902]">🆕 Recent Students</h2>
          {recentStudents.length > 0 && (
            <Link
              href="/teacher-portal/students"
              className="text-xs font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
            >
              View All →
            </Link>
          )}
        </div>
        
        {recentStudents.length === 0 ? (
          <div className="py-8 text-center">
            <Users size={40} className="mx-auto text-[#8B5E3C]/20 mb-2" />
            <p className="text-sm text-[#8B5E3C]/50">
              No students in your class yet.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentStudents.map((s, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-sm p-3 bg-[#FAF7F2] rounded-xl hover:bg-[#8B5E3C]/5 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#8B5E3C]/10 flex items-center justify-center text-xs font-bold text-[#8B5E3C] flex-shrink-0">
                    {s.firstName[0]}{s.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-[#3D1902]">
                      {s.firstName} {s.lastName}
                    </span>
                    <span className="text-[#8B5E3C]/50 ml-2 text-xs">{s.studentId}</span>
                  </div>
                </div>
                <span className="text-xs text-[#8B5E3C]/40 sm:flex-shrink-0 pl-10 sm:pl-0">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}