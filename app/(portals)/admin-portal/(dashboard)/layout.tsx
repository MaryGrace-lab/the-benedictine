// ──────────────────────────────────────────────
// Admin Portal Layout — Server Component
// Wraps all dashboard pages with sidebar navigation.
// Login page is excluded via route group (auth).
// ──────────────────────────────────────────────

import type { Metadata } from "next";
import AdminSidebar from "@/components/ui/AdminSidebar";

export const metadata: Metadata = {
  title: "The Benedictine Academy | Admin Portal",
  description: "Enterprise School Management Workspace",
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminSidebar />
      {/* ml-64 for expanded sidebar, ml-20 for collapsed — handled by the sidebar itself */}
      <main className="flex-1 overflow-x-hidden ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}