// ──────────────────────────────────────────────
// Teacher Settings Page — Server Component
// ──────────────────────────────────────────────

import { Toaster } from "react-hot-toast";
import ChangePasswordForm from "@/components/ui/ChangePasswordForm";
import BackButton from "@/components/ui/BackButton";
import { Lock, Shield } from "lucide-react";

export const dynamic = "force-dynamic";
export default function TeacherSettingsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#3D1902] mb-2">⚙️ Settings</h1>
        <p className="text-sm text-[#8B5E3C]/60 mb-6">
          Manage your account and security
        </p>

        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 flex items-center justify-center">
                <Lock size={20} className="text-[#8B5E3C]" />
              </div>
              <div>
                <h2 className="font-bold text-[#3D1902]">Change Password</h2>
                <p className="text-xs text-[#8B5E3C]/50">Update your login credentials</p>
              </div>
            </div>
            <div className="max-w-md">
              <ChangePasswordForm role="teacher" redirectTo="/teacher-portal/login" />
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Shield size={20} className="text-purple-700" />
              </div>
              <div>
                <h2 className="font-bold text-[#3D1902]">System Information</h2>
                <p className="text-xs text-[#8B5E3C]/50">About this application</p>
              </div>
            </div>
            <div className="text-sm text-[#8B5E3C]/70 space-y-1">
              <p>• The Benedictine Academy Portal v1.0</p>
              <p>• Built with Next.js, Prisma & PostgreSQL</p>
              <p>• Secured with JWT authentication</p>
              <p>• © {new Date().getFullYear()} The Benedictine Academy</p>
            </div>
          </div>
        </div>

        <BackButton href="/teacher-portal/dashboard" label="Back to Dashboard" />
      </div>
    </div>
  );
}