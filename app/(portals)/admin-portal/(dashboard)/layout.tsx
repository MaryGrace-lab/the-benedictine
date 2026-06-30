// ──────────────────────────────────────────────
// Admin Portal Layout — Server Component
// Wraps all dashboard pages with sidebar navigation.
// Login page is excluded via route group (auth).
// ──────────────────────────────────────────────

// Admin Portal Layout — Server Component
import type { Metadata } from "next";
import AdminSidebar from "@/components/ui/AdminSidebar";

export const metadata: Metadata = {
  title: "The Benedictine Academy | Admin Portal",
  description: "Enterprise School Management Workspace",
};

export default function AdminDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}