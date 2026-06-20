// ──────────────────────────────────────────────
// Teacher Dashboard — Server Component
// Shows class stats, quick actions, recent students.
// ──────────────────────────────────────────────

import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/ui/LogoutButton";
import { prisma } from "@/lib/prisma";
import { getTeacherFromSession } from "@/lib/jwt";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-[#3D1902]">Teacher Dashboard</h1>
              <p className="text-sm text-[#8B5E3C]/70">
                {teacher?.name} — {teacher?.assignedClass || "No class assigned"}
              </p>
            </div>
          </div>
          <LogoutButton type="teacher" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
            <p className="text-3xl font-bold text-[#8B5E3C]">{studentCount}</p>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">Students in {teacher?.assignedClass}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
            <p className="text-3xl font-bold text-[#8B5E3C]">{resultCount}</p>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">Results Uploaded</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/teacher-portal/results/upload"
            className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-[#3D1902]">📝 Upload Results</h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">Enter scores for your class</p>
          </Link>
          <Link
            href="/teacher-portal/results/bulk-upload"
            className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-[#3D1902]">📊 Bulk Upload</h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">Upload results for your entire class at once</p>
          </Link>
          <Link
            href="/teacher-portal/students"
            className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-[#3D1902]">👥 My Students</h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">View students in {teacher?.assignedClass}</p>
          </Link>
          <Link
            href="/teacher-portal/settings"
            className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-[#3D1902]">⚙️ Settings</h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">Change password and preferences</p>
          </Link>
        </div>

        {/* Recent Students */}
        <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm">
          <h2 className="text-lg font-semibold text-[#3D1902] mb-4">🆕 Recent Students</h2>
          {recentStudents.length === 0 ? (
            <p className="text-sm text-[#8B5E3C]/50">No students in your class yet.</p>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                  <div>
                    <span className="font-medium text-[#3D1902]">
                      {s.firstName} {s.lastName}
                    </span>
                    <span className="text-[#8B5E3C]/50 ml-2 text-xs">{s.studentId}</span>
                  </div>
                  <span className="text-xs text-[#8B5E3C]/40">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}