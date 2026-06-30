"use client";

// ──────────────────────────────────────────────
// Admin Settings — Client Component
// Uses reusable ChangePasswordForm component.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Bell, Shield, ArrowLeft } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ChangePasswordForm from "@/components/ui/ChangePasswordForm";

export default function SettingsClient() {
  const [notifyOnUpload, setNotifyOnUpload] = useState(true);
  const [notifyOnNewStudent, setNotifyOnNewStudent] = useState(true);

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      
      <div>
        <h1 className="text-2xl font-bold text-[#3D1902]">⚙️ Settings</h1>
        <p className="text-sm text-[#8B5E3C]/60 mt-1">
          Manage your account and system preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* ── Change Password ── */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
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
            <ChangePasswordForm role="admin" redirectTo="/admin-portal/login" />
          </div>
        </div>

        {/* ── Notification Preferences ── */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Bell size={20} className="text-blue-700" />
            </div>
            <div>
              <h2 className="font-bold text-[#3D1902]">Notifications</h2>
              <p className="text-xs text-[#8B5E3C]/50">Manage what you get notified about</p>
            </div>
          </div>

          <div className="space-y-3 max-w-md">
            <label className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl cursor-pointer hover:bg-[#8B5E3C]/5 transition-colors">
              <div>
                <p className="text-sm font-medium text-[#3D1902]">Result Upload Alerts</p>
                <p className="text-xs text-[#8B5E3C]/50">Get notified when results are uploaded</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnUpload}
                onChange={(e) => setNotifyOnUpload(e.target.checked)}
                className="w-5 h-5 accent-[#8B5E3C] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl cursor-pointer hover:bg-[#8B5E3C]/5 transition-colors">
              <div>
                <p className="text-sm font-medium text-[#3D1902]">New Student Registration</p>
                <p className="text-xs text-[#8B5E3C]/50">Get notified when a new student is created</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnNewStudent}
                onChange={(e) => setNotifyOnNewStudent(e.target.checked)}
                className="w-5 h-5 accent-[#8B5E3C] rounded"
              />
            </label>
          </div>
        </div>

        {/* ── System Info ── */}
        <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-5 sm:p-6">
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

      <Link
        href="/admin-portal/dashboard"
        className="inline-flex items-center gap-1 py-3 text-sm font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}