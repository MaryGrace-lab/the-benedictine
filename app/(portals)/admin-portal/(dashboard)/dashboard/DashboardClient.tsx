"use client";

// ──────────────────────────────────────────────
// Dashboard Client Component
// Handles animations, chart, and interactive UI.
// Receives all data as props from the server page.
// Mobile responsive with proper touch targets.
// ──────────────────────────────────────────────

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Upload,
  Users,
  GraduationCap,
  ClipboardList,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Map icon names (strings) to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  users: Users,
  graduationcap: GraduationCap,
  clipboardlist: ClipboardList,
  barchart3: BarChart3,
};

// Type definitions for props
type Stat = {
  label: string;
  value: string | number;
  icon: string;
};

type ChartData = {
  name: string;
  students: number;
};

type RecentStudent = {
  firstName: string;
  lastName: string;
  class: string;
  studentId: string;
  createdAt: Date;
};

type RecentResult = {
  percentageAvg: number | null;
  remark: string | null;
  student: { firstName: string; lastName: string };
  session: { year: string; term: string };
};

type Props = {
  stats: Stat[];
  chartData: ChartData[];
  activeSession: { year: string; term: string } | null;
  recentStudents: RecentStudent[];
  recentResults: RecentResult[];
};

export default function DashboardClient({
  stats,
  chartData,
  activeSession,
  recentStudents,
  recentResults,
}: Props) {
  // Helper: safely get icon component from string name
  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName.toLowerCase()] || Users;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3D1902]">Admin Dashboard</h1>
          <p className="text-sm text-[#8B5E3C]/60 mt-0.5">
            {activeSession
              ? `Active Session: ${activeSession.year} — ${activeSession.term} Term`
              : "No Active Session Configured"}
          </p>
        </div>
        <Link
          href="/admin-portal/results/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8B5E3C] text-white rounded-xl text-sm font-bold hover:bg-[#6B3F2C] transition-all shadow-md shadow-[#8B5E3C]/20 active:scale-95 min-h-[44px]"
        >
          <Upload size={16} />
          Upload Results
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => {
          const IconComponent = getIcon(stat.icon);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <IconComponent size={20} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#3D1902]">{stat.value}</p>
              <p className="text-xs text-[#8B5E3C]/50 font-medium mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Chart: Students by Class ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#8B5E3C]/10 shadow-sm">
        <h2 className="text-lg font-bold text-[#3D1902] mb-4 flex items-center gap-2">
          📊 Students by Class
        </h2>
        {chartData.length === 0 ? (
          <div className="py-12 text-center">
            <BarChart3 size={48} className="mx-auto text-[#8B5E3C]/20 mb-3" />
            <p className="text-sm text-[#8B5E3C]/50">
              No students registered yet.
            </p>
          </div>
        ) : (
          <div className="h-[250px] sm:h-[300px] -ml-4 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B5E3C15" />
                <XAxis dataKey="name" stroke="#8B5E3C" fontSize={12} tickMargin={8} />
                <YAxis stroke="#8B5E3C" fontSize={12} width={40} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #8B5E3C20",
                    borderRadius: "12px",
                    fontSize: "14px",
                  }}
                />
                <Bar 
                  dataKey="students" 
                  fill="#8B5E3C" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── Recent Activity ── */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#8B5E3C]/10 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#3D1902]">🆕 Recent Students</h2>
            <Link
              href="/admin-portal/students"
              className="text-xs font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
            >
              View All →
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <div className="py-8 text-center">
              <Users size={40} className="mx-auto text-[#8B5E3C]/20 mb-2" />
              <p className="text-sm text-[#8B5E3C]/50">
                No students registered yet.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentStudents.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl hover:bg-[#8B5E3C]/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C]/20 to-[#8B5E3C]/10 flex items-center justify-center text-sm font-black text-[#8B5E3C] flex-shrink-0">
                    {s.firstName[0]}
                    {s.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#3D1902] truncate">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-[10px] text-[#8B5E3C]/50 font-medium">
                      {s.class} • {s.studentId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#8B5E3C]/10 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#3D1902]">📝 Recent Results</h2>
            <Link
              href="/admin-portal/results/upload"
              className="text-xs font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
            >
              Upload New →
            </Link>
          </div>
          {recentResults.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList size={40} className="mx-auto text-[#8B5E3C]/20 mb-2" />
              <p className="text-sm text-[#8B5E3C]/50">
                No results uploaded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentResults.map((r, i) => {
                const avgScore = Number(r.percentageAvg || 0);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl hover:bg-[#8B5E3C]/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 flex items-center justify-center text-sm font-bold text-[#8B5E3C] flex-shrink-0">
                        {r.student.firstName[0]}
                        {r.student.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#3D1902] truncate">
                          {r.student.firstName} {r.student.lastName}
                        </p>
                        <p className="text-[10px] text-[#8B5E3C]/50">
                          {r.session.year} • {r.session.term}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-black px-3 py-1.5 rounded-xl flex-shrink-0 ml-2 ${
                        avgScore >= 70
                          ? "bg-emerald-100 text-emerald-700"
                          : avgScore >= 50
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {avgScore > 0 ? `${avgScore}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}