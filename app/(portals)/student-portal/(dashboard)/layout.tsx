// ──────────────────────────────────────────────
// Student Portal Layout — Server Component
// Wraps all student dashboard pages with sidebar.
// Login page is excluded via route group (auth).
// ──────────────────────────────────────────────

import type { Metadata } from "next";
import StudentSidebar from "@/components/ui/StudentSidebar";

export const metadata: Metadata = {
  title: "Student Portal — The Benedictine Academy",
  description: "View your academic results, report cards, and account settings.",
};

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Fixed sidebar */}
      <StudentSidebar />

      {/* Main content — offset to match sidebar width */}
      <main className="flex-1 overflow-x-hidden ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}