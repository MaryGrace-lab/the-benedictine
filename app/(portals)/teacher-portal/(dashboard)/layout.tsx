// ──────────────────────────────────────────────
// Teacher Portal Layout — Server Component
// Wraps all teacher dashboard pages with sidebar.
// Mobile responsive with hamburger menu support.
// ──────────────────────────────────────────────

import type { Metadata } from "next";
import TeacherSidebar from "@/components/ui/TeacherSidebar";

export const metadata: Metadata = {
  title: {
    default: "Teacher Portal — The Benedictine Academy",
    template: "%s — The Benedictine Academy",
  },
  description: "Manage your class results and student records.",
};

export default function TeacherPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <TeacherSidebar />
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}