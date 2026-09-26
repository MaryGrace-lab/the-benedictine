// app/(portals)/student-portal/(dashboard)/profile/page.tsx
// ──────────────────────────────────────────────
// Student Profile Page — Server Component
// Read-only view of student information.
// ──────────────────────────────────────────────

import { getStudentFromSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  BookOpen,
  GraduationCap,
  Calendar,
  Lock,
  Shield,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const sessionStudentId = await getStudentFromSession();
  if (!sessionStudentId) {
    redirect("/student-portal/login");
  }

  const student = await prisma.student.findUnique({
    where: { studentId: sessionStudentId },
    select: {
      studentId: true,
      firstName: true,
      lastName: true,
      class: true,
      studentType: true,
    },
  });

  if (!student) {
    redirect("/student-portal/login");
  }

  const activeSession = await prisma.academicSession.findFirst({
    where: { isActive: true },
    select: { year: true, term: true },
  });

  const sessionLabel = activeSession
    ? `${activeSession.year} — ${activeSession.term} Term`
    : "Not yet assigned";

  const departmentLabel = student.studentType
    ? student.studentType.charAt(0) + student.studentType.slice(1).toLowerCase()
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#3D1902]">👤 My Profile</h1>
        <p className="text-sm text-[#8B5E3C]/60 mt-1">
          Your personal and academic information
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8B5E3C]/15 to-[#8B5E3C]/5 flex items-center justify-center flex-shrink-0 border border-[#8B5E3C]/10">
            <span className="text-3xl font-black text-[#8B5E3C]">
              {student.firstName[0]}
              {student.lastName[0]}
            </span>
          </div>

          {/* Name */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-[#3D1902]">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-sm text-[#8B5E3C]/60 mt-1 font-mono">
              {student.studentId}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs bg-[#8B5E3C]/10 text-[#8B5E3C] px-3 py-1 rounded-full font-semibold">
              <Lock size={12} />
              Read-only profile
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
        <h3 className="font-bold text-[#3D1902] mb-4 flex items-center gap-2">
          <GraduationCap size={18} />
          Academic Information
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 bg-[#FAF7F2] rounded-xl">
            <p className="text-xs text-[#8B5E3C]/60 mb-1 flex items-center gap-1">
              <BookOpen size={12} /> Student ID
            </p>
            <p className="text-sm font-semibold text-[#3D1902] font-mono">
              {student.studentId}
            </p>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl">
            <p className="text-xs text-[#8B5E3C]/60 mb-1 flex items-center gap-1">
              <User size={12} /> Class
            </p>
            <p className="text-sm font-semibold text-[#3D1902]">
              {student.class}
            </p>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl">
            <p className="text-xs text-[#8B5E3C]/60 mb-1 flex items-center gap-1">
              <GraduationCap size={12} /> Department / Section
            </p>
            <p className="text-sm font-semibold text-[#3D1902]">
              {departmentLabel}
            </p>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl">
            <p className="text-xs text-[#8B5E3C]/60 mb-1 flex items-center gap-1">
              <Calendar size={12} /> Current Session
            </p>
            <p className="text-sm font-semibold text-[#3D1902]">
              {sessionLabel}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#8B5E3C]/50 text-center sm:text-left">
          To update any of this information, please contact the school office.
        </p>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
        <h3 className="font-bold text-[#3D1902] mb-3 flex items-center gap-2">
          <Shield size={18} />
          System Information
        </h3>
        <div className="text-sm text-[#8B5E3C]/70 space-y-1">
          <p>• The Benedictine Academy Portal v1.0</p>
          <p>• Secured with JWT authentication</p>
          <p>• © {new Date().getFullYear()} The Benedictine Academy</p>
        </div>
      </div>

      <Link
        href="/student-portal/dashboard"
        className="inline-flex items-center gap-1 py-3 text-sm font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}