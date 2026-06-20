"use client";

// ──────────────────────────────────────────────
// Student Dashboard Client — Client Component
// Shows profile card, stats, and quick actions.
// ──────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { FileText, Lock, User, TrendingUp, Calendar } from "lucide-react";

type Student = {
  firstName: string;
  lastName: string;
  class: string;
  studentId: string;
  studentType: string | null;
};

type Props = {
  student: Student;
  latestResult: { percentageAvg: number | null; remark: string | null; totalScore: number | null; totalCumulative: number | null } | null;
  totalSessions: number;
  hasActiveResult: boolean;
};

export default function StudentDashboardClient({ student, latestResult, totalSessions, hasActiveResult }: Props) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#3D1902] mb-2">Welcome, {student.firstName}! 👋</h1>
        <p className="text-sm text-[#8B5E3C]/60 mb-6">
          Here's your academic overview
        </p>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-2xl font-black text-blue-700">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3D1902]">
                {student.firstName} {student.lastName}
              </h2>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-[#8B5E3C]/70">
                <span className="flex items-center gap-1"><User size={14} /> {student.class}</span>
                <span className="flex items-center gap-1"><FileText size={14} /> {student.studentId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-[#8B5E3C]/10 text-center">
            <Calendar size={24} className="mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-black text-[#3D1902]">{totalSessions}</p>
            <p className="text-xs text-[#8B5E3C]/50">Terms Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#8B5E3C]/10 text-center">
            <TrendingUp size={24} className="mx-auto mb-2 text-emerald-600" />
            <p className="text-2xl font-black text-[#3D1902]">
              {hasActiveResult ? `${latestResult?.percentageAvg}%` : "—"}
            </p>
            <p className="text-xs text-[#8B5E3C]/50">Latest Average</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/student-portal/results"
            className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <FileText size={28} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-[#3D1902]">View Results</h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">Check your academic performance</p>
          </Link>
          <Link
            href="/student-portal/settings"
            className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <Lock size={28} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-[#3D1902]">Change Password</h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">Update your login credentials</p>
          </Link>
        </div>

        {/* Latest Result Summary */}
        {hasActiveResult && latestResult && (
          <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6">
            <h2 className="font-bold text-[#3D1902] mb-3">Latest Result Summary</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#FAF7F2] rounded-xl p-3">
                <p className="text-lg font-black text-[#8B5E3C]">{latestResult.totalScore}/{latestResult.totalCumulative}</p>
                <p className="text-xs text-[#8B5E3C]/50">Total Score</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-3">
                <p className="text-lg font-black text-[#8B5E3C]">{latestResult.percentageAvg}%</p>
                <p className="text-xs text-[#8B5E3C]/50">Average</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-3">
                <p className="text-lg font-black text-[#8B5E3C]">{latestResult.remark || "—"}</p>
                <p className="text-xs text-[#8B5E3C]/50">Remark</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}