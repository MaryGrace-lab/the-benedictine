// ──────────────────────────────────────────────
// Student Portal Layout — Server Component
// Wraps all student dashboard pages with sidebar.
// Mobile responsive with hamburger menu support.
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
      <StudentSidebar />
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}