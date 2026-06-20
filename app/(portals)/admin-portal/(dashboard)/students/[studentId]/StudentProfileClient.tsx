"use client";

// ──────────────────────────────────────────────
// Student Profile Client — Client Component
// Displays student info, stats, and result history.
// ──────────────────────────────────────────────

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Award, TrendingUp, BookOpen } from "lucide-react";

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
  classTeacherComment: string | null;
};

interface Props {
  student: Student;
  history: HistoryEntry[];
  bestPerformance: number;
  latestPerformance: number | null;
  totalSessions: number;
}

export default function StudentProfileClient({
  student,
  history,
  bestPerformance,
  latestPerformance,
  totalSessions,
}: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb + Back */}
        <div className="flex items-center gap-2 text-sm text-[#8B5E3C]/60 mb-6">
          <Link href="/admin-portal/dashboard" className="hover:text-[#8B5E3C]">Dashboard</Link>
          <span>/</span>
          <Link href="/admin-portal/students" className="hover:text-[#8B5E3C]">Students</Link>
          <span>/</span>
          <span className="text-[#3D1902] font-medium">{student.firstName} {student.lastName}</span>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5E3C]/20 to-[#8B5E3C]/10 flex items-center justify-center text-3xl font-black text-[#8B5E3C] flex-shrink-0">
              {student.firstName[0]}{student.lastName[0]}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#3D1902]">
                {student.firstName} {student.lastName}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-[#8B5E3C]/70">
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {student.class}
                  {student.studentType && ` (${student.studentType})`}
                </span>
                <span className="flex items-center gap-1">
                  <Award size={14} /> Card: {student.studentId}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Joined: {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Guardian Info */}
          {(student.guardianName || student.guardianPhone) && (
            <div className="mt-4 pt-4 border-t border-[#8B5E3C]/5 flex flex-wrap gap-4 text-sm">
              {student.guardianName && (
                <span className="flex items-center gap-1 text-[#8B5E3C]/70">
                  <Mail size={14} /> {student.guardianName}
                </span>
              )}
              {student.guardianPhone && (
                <span className="flex items-center gap-1 text-[#8B5E3C]/70">
                  <Phone size={14} /> {student.guardianPhone}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center">
            <p className="text-2xl font-black text-[#8B5E3C]">{totalSessions}</p>
            <p className="text-xs text-[#8B5E3C]/50 mt-1">Terms Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center">
            <p className="text-2xl font-black text-emerald-600">{latestPerformance ?? "—"}%</p>
            <p className="text-xs text-[#8B5E3C]/50 mt-1">Latest Average</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center">
            <p className="text-2xl font-black text-amber-600">{bestPerformance}%</p>
            <p className="text-xs text-[#8B5E3C]/50 mt-1">Best Performance</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center">
            <p className="text-2xl font-black text-blue-600">
              {history.length > 0 && history[0].percentageAvg
                ? history[0].percentageAvg >= 70 ? "Good" : history[0].percentageAvg >= 50 ? "Fair" : "Needs Help"
                : "—"}
            </p>
            <p className="text-xs text-[#8B5E3C]/50 mt-1">Current Status</p>
          </div>
        </div>

        {/* Result History */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#3D1902] mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Result History
          </h2>

          {history.length === 0 ? (
            <p className="text-sm text-[#8B5E3C]/50 py-4 text-center">
              No results recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAF7F2] rounded-xl hover:bg-[#8B5E3C]/5 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                      entry.session.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[#8B5E3C]/10 text-[#8B5E3C]"
                    }`}>
                      {entry.session.term[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#3D1902] text-sm">
                        {entry.session.year} — {entry.session.term} Term
                        {entry.session.isActive && (
                          <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-semibold">
                            Active
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#8B5E3C]/50">
                        {entry.subjects} subjects • {entry.remark || "No remark"}
                      </p>
                      {entry.classTeacherComment && (
                        <p className="text-xs text-[#8B5E3C]/40 mt-0.5 italic">
                          "{entry.classTeacherComment}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-black text-[#3D1902]">
                        {entry.percentageAvg ?? "—"}%
                      </p>
                      <p className="text-[10px] text-[#8B5E3C]/50">
                        {entry.totalScore} / {entry.totalCumulative}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                        entry.grade === "A"
                          ? "bg-emerald-100 text-emerald-700"
                          : entry.grade === "B"
                          ? "bg-blue-100 text-blue-700"
                          : entry.grade === "C"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {entry.grade || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/admin-portal/students")}
          className="w-full mt-6 py-3 text-sm font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Students
        </button>
      </div>
    </div>
  );
}