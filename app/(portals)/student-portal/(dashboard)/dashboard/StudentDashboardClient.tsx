"use client";

// ──────────────────────────────────────────────
// Student Dashboard Client — Client Component
// Shows profile card, stats, notifications, quick actions.
// Mobile responsive with proper empty states.
// ──────────────────────────────────────────────

import Link from "next/link";
import {
  FileText,
  User,
  TrendingUp,
  Calendar,
  AlertCircle,
  Bell,
  RefreshCw,
} from "lucide-react";

type Student = {
  firstName: string;
  lastName: string;
  class: string;
  studentId: string;
  studentType: string | null;
};

type NotificationItem = {
  id: string;
  type: "new" | "updated";
  sessionLabel: string;
  timestamp: string;
};

type Props = {
  student: Student;
  latestResult: {
    percentageAvg: number | null;
    remark: string | null;
    totalScore: number | null;
    totalCumulative: number | null;
  } | null;
  totalSessions: number;
  hasActiveResult: boolean;
  notifications: NotificationItem[];
};

export default function StudentDashboardClient({
  student,
  latestResult,
  totalSessions,
  hasActiveResult,
  notifications,
}: Props) {
  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#3D1902]">
          Welcome, {student.firstName}! 👋
        </h1>
        <p className="text-sm text-[#8B5E3C]/60 mt-1">
          Here&apos;s your academic overview
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-xl sm:text-2xl font-black text-blue-700 flex-shrink-0">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#3D1902] truncate">
              {student.firstName} {student.lastName}
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-[#8B5E3C]/70">
              <span className="flex items-center gap-1">
                <User size={14} className="flex-shrink-0" />
                <span className="truncate">{student.class}</span>
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} className="flex-shrink-0" />
                <span className="truncate">{student.studentId}</span>
              </span>
              {student.studentType && (
                <span className="text-xs bg-[#8B5E3C]/10 px-2 py-0.5 rounded-full font-medium">
                  {student.studentType}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
          <h2 className="font-bold text-[#3D1902] mb-4 flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </h2>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#8B5E3C]/5"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.type === "updated"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {n.type === "updated" ? (
                    <RefreshCw size={16} />
                  ) : (
                    <Bell size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#3D1902]">
                    {n.type === "updated"
                      ? "Result Updated"
                      : "New Result Available"}
                  </p>
                  <p className="text-xs text-[#8B5E3C]/60 mt-0.5">
                    Your {n.sessionLabel} result{" "}
                    {n.type === "updated"
                      ? "has been updated by the school."
                      : "is now available."}
                  </p>
                </div>
                <span className="text-[10px] text-[#8B5E3C]/40 flex-shrink-0 mt-1">
                  {formatTimestamp(n.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#8B5E3C]/10 text-center hover:shadow-md transition-shadow">
          <Calendar size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-black text-[#3D1902]">{totalSessions}</p>
          <p className="text-xs text-[#8B5E3C]/50 mt-1">Terms Completed</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#8B5E3C]/10 text-center hover:shadow-md transition-shadow">
          <TrendingUp size={24} className="mx-auto mb-2 text-emerald-600" />
          {hasActiveResult && latestResult?.percentageAvg != null ? (
            <>
              <p className="text-2xl font-black text-[#3D1902]">
                {latestResult.percentageAvg}%
              </p>
              <p className="text-xs text-[#8B5E3C]/50 mt-1">Latest Average</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-black text-[#8B5E3C]/20">—</p>
              <p className="text-xs text-[#8B5E3C]/40 mt-1">No results yet</p>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#3D1902] mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/student-portal/results"
            className="bg-white p-5 sm:p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <FileText
              size={28}
              className="text-blue-600 mb-3 group-hover:scale-110 transition-transform"
            />
            <h3 className="font-bold text-[#3D1902] group-hover:text-[#8B5E3C] transition-colors">
              View Results
            </h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">
              Check your academic performance
            </p>
          </Link>

          <Link
            href="/student-portal/profile"
            className="bg-white p-5 sm:p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all group"
          >
            <User
              size={28}
              className="text-amber-600 mb-3 group-hover:scale-110 transition-transform"
            />
            <h3 className="font-bold text-[#3D1902] group-hover:text-[#8B5E3C] transition-colors">
              My Profile
            </h3>
            <p className="text-sm text-[#8B5E3C]/50 mt-1">
              View your personal information
            </p>
          </Link>
        </div>
      </div>

      {/* Latest Result Summary */}
      {hasActiveResult && latestResult ? (
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
          <h2 className="font-bold text-[#3D1902] mb-4">
            📊 Latest Result Summary
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="bg-[#FAF7F2] rounded-xl p-3 sm:p-4">
              <p className="text-base sm:text-lg font-black text-[#8B5E3C]">
                {latestResult.totalScore ?? "—"}/
                {latestResult.totalCumulative ?? "—"}
              </p>
              <p className="text-xs text-[#8B5E3C]/50 mt-1">Total Score</p>
            </div>
            <div className="bg-[#FAF7F2] rounded-xl p-3 sm:p-4">
              <p className="text-base sm:text-lg font-black text-[#8B5E3C]">
                {latestResult.percentageAvg != null
                  ? `${latestResult.percentageAvg}%`
                  : "—"}
              </p>
              <p className="text-xs text-[#8B5E3C]/50 mt-1">Average</p>
            </div>
            <div className="bg-[#FAF7F2] rounded-xl p-3 sm:p-4">
              <p className="text-base sm:text-lg font-black text-[#8B5E3C]">
                {latestResult.remark || "—"}
              </p>
              <p className="text-xs text-[#8B5E3C]/50 mt-1">Remark</p>
            </div>
          </div>
        </div>
      ) : hasActiveResult && !latestResult ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-center">
          <AlertCircle size={32} className="mx-auto text-amber-500 mb-2" />
          <p className="font-semibold text-amber-700">Results Not Available</p>
          <p className="text-sm text-amber-600 mt-1">
            Your results are being processed. Please check back later.
          </p>
        </div>
      ) : null}
    </div>
  );
}