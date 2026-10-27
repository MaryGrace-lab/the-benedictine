"use client";

// ──────────────────────────────────────────────
// Teacher Student Profile Client — Client Component
// Displays student info, stats, and result history.
// ──────────────────────────────────────────────

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, Calendar, BookOpen, TrendingUp, Phone } from "lucide-react";

type Student = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  class: string;
  studentType: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  createdAt: Date;
};

type HistoryEntry = {
  id: string;
  session: { year: string; term: string; isActive: boolean };
  totalCumulative: number | null;
  totalScore: number | null;
  percentageAvg: number | null;
  grade: string | null;
  remark: string | null;
  subjects: number;
};

interface Props {
  student: Student;
  history: HistoryEntry[];
  bestPerformance: number;
  totalSessions: number;
}

export default function TeacherStudentProfileClient({
  student,
  history,
  bestPerformance,
  totalSessions,
}: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8B5E3C]/60 mb-6">
          <Link href="/teacher-portal/dashboard" className="hover:text-[#8B5E3C]">Dashboard</Link>
          <span>/</span>
          <Link href="/teacher-portal/students" className="hover:text-[#8B5E3C]">My Students</Link>
          <span>/</span>
          <span className="text-[#3D1902] font-medium">{student.firstName} {student.lastName}</span>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5E3C]/20 to-[#8B5E3C]/10 flex items-center justify-center text-3xl font-black text-[#8B5E3C] flex-shrink-0">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#3D1902]">
                {student.firstName} {student.lastName}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-[#8B5E3C]/70">
                <span className="flex items-center gap-1"><BookOpen size={14} /> {student.class}{student.studentType && ` (${student.studentType})`}</span>
                <span className="flex items-center gap-1"><Award size={14} /> Card: {student.studentId}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined: {new Date(student.createdAt).toLocaleDateString()}</span>
              </div>
              {(student.guardianName || student.guardianPhone) && (
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#8B5E3C]/70">
                  {student.guardianName && <span>{student.guardianName}</span>}
                  {student.guardianPhone && <span className="flex items-center gap-1"><Phone size={14} /> {student.guardianPhone}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center">
            <p className="text-2xl font-black text-[#8B5E3C]">{totalSessions}</p>
            <p className="text-xs text-[#8B5E3C]/50">Terms</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center">
            <p className="text-2xl font-black text-[#8B5E3C]">{bestPerformance}%</p>
            <p className="text-xs text-[#8B5E3C]/50">Best</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center">
            <p className="text-2xl font-black text-[#8B5E3C]">
              {history.length > 0 && history[0].percentageAvg ? `${history[0].percentageAvg}%` : "—"}
            </p>
            <p className="text-xs text-[#8B5E3C]/50">Latest</p>
          </div>
        </div>

        {/* Result History */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#3D1902] mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Result History
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-[#8B5E3C]/50 py-4 text-center">No results recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAF7F2] rounded-xl gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${entry.session.isActive ? "bg-emerald-100 text-emerald-700" : "bg-[#8B5E3C]/10 text-[#8B5E3C]"}`}>
                      {entry.session.term[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#3D1902] text-sm">
                        {entry.session.year} — {entry.session.term} Term
                        {entry.session.isActive && <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px]">Active</span>}
                      </p>
                      <p className="text-xs text-[#8B5E3C]/50">{entry.subjects} subjects • {entry.remark || "No remark"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-black text-[#3D1902]">{entry.percentageAvg ?? "—"}%</p>
                      <p className="text-[10px] text-[#8B5E3C]/50">{entry.totalScore} / {entry.totalCumulative}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${entry.grade === "A" ? "bg-emerald-100 text-emerald-700" : entry.grade === "B" ? "bg-blue-100 text-blue-700" : entry.grade === "C" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                      {entry.grade || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => router.push("/teacher-portal/students")} className="w-full mt-6 py-3 text-sm font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors flex items-center justify-center gap-1">
          <ArrowLeft size={16} /> Back to Students
        </button>
      </div>
    </div>
  );
}