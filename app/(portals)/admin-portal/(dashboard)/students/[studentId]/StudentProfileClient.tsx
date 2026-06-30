"use client";

// ──────────────────────────────────────────────
// Student Profile Client — Client Component
// Displays student info, stats, and result history.
// ──────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { Mail, Phone, Calendar, Award, TrendingUp, BookOpen, ArrowLeft, GraduationCap } from "lucide-react";

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
  const getStatusLabel = (avg: number | null): string => {
    if (avg === null) return "—";
    if (avg >= 90) return "Excellent";
    if (avg >= 70) return "Good";
    if (avg >= 50) return "Fair";
    return "Needs Support";
  };

  const getStatusColor = (avg: number | null): string => {
    if (avg === null) return "text-slate-400";
    if (avg >= 70) return "text-emerald-600";
    if (avg >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8B5E3C]/60">
        <Link href="/admin-portal/dashboard" className="hover:text-[#8B5E3C] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/admin-portal/students" className="hover:text-[#8B5E3C] transition-colors">
          Students
        </Link>
        <span>/</span>
        <span className="text-[#3D1902] font-medium truncate">
          {student.firstName} {student.lastName}
        </span>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#8B5E3C]/20 to-[#8B5E3C]/10 flex items-center justify-center text-2xl sm:text-3xl font-black text-[#8B5E3C] flex-shrink-0">
            {student.firstName[0]}{student.lastName[0]}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#3D1902] truncate">
              {student.firstName} {student.lastName}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-[#8B5E3C]/70">
              <span className="flex items-center gap-1">
                <BookOpen size={14} className="flex-shrink-0" /> 
                {student.class}
                {student.studentType && (
                  <span className="text-xs bg-[#8B5E3C]/10 px-2 py-0.5 rounded-full">
                    {student.studentType}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap size={14} className="flex-shrink-0" /> 
                {student.studentId}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} className="flex-shrink-0" /> 
                Joined {new Date(student.createdAt).toLocaleDateString()}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center hover:shadow-md transition-shadow">
          <Calendar size={20} className="mx-auto mb-2 text-[#8B5E3C]" />
          <p className="text-xl sm:text-2xl font-black text-[#8B5E3C]">{totalSessions}</p>
          <p className="text-xs text-[#8B5E3C]/50 mt-1">Terms Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center hover:shadow-md transition-shadow">
          <TrendingUp size={20} className="mx-auto mb-2 text-emerald-600" />
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            {latestPerformance !== null ? `${latestPerformance}%` : "—"}
          </p>
          <p className="text-xs text-[#8B5E3C]/50 mt-1">Latest Average</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center hover:shadow-md transition-shadow">
          <Award size={20} className="mx-auto mb-2 text-amber-600" />
          <p className="text-xl sm:text-2xl font-black text-amber-600">
            {bestPerformance > 0 ? `${bestPerformance}%` : "—"}
          </p>
          <p className="text-xs text-[#8B5E3C]/50 mt-1">Best Performance</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#8B5E3C]/10 text-center hover:shadow-md transition-shadow">
          <BookOpen size={20} className="mx-auto mb-2 text-blue-600" />
          <p className={`text-xl sm:text-2xl font-black ${getStatusColor(latestPerformance)}`}>
            {getStatusLabel(latestPerformance)}
          </p>
          <p className="text-xs text-[#8B5E3C]/50 mt-1">Current Status</p>
        </div>
      </div>

      {/* Result History */}
      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[#3D1902] mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Result History
        </h2>

        {history.length === 0 ? (
          <div className="py-12 text-center">
            <Award size={48} className="mx-auto text-[#8B5E3C]/15 mb-3" />
            <p className="text-sm text-[#8B5E3C]/50">
              No results recorded yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAF7F2] rounded-xl hover:bg-[#8B5E3C]/5 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                      entry.session.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[#8B5E3C]/10 text-[#8B5E3C]"
                    }`}
                  >
                    {entry.session.term[0]}
                  </div>
                  <div className="min-w-0">
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
                      <p className="text-xs text-[#8B5E3C]/40 mt-0.5 italic truncate">
                        &ldquo;{entry.classTeacherComment}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-black text-[#3D1902]">
                      {entry.percentageAvg !== null ? `${entry.percentageAvg}%` : "—"}
                    </p>
                    <p className="text-[10px] text-[#8B5E3C]/50">
                      {entry.totalScore ?? "—"} / {entry.totalCumulative ?? "—"}
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
      <Link
        href="/admin-portal/students"
        className="inline-flex items-center gap-1 py-3 text-sm font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Students
      </Link>
    </div>
  );
}