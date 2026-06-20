"use client";

// ──────────────────────────────────────────────
// Admin Settings — Client Component
// Change password, account info, system preferences.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Shield, Bell, Palette } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SettingsClient() {
  const router = useRouter();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Notification preferences (placeholder)
  const [notifyOnUpload, setNotifyOnUpload] = useState(true);
  const [notifyOnNewStudent, setNotifyOnNewStudent] = useState(true);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, role: "admin" }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password changed! Please login again.");
        await fetch("/api/auth/admin-logout", { method: "POST" });
        setTimeout(() => router.push("/admin-portal/login"), 1500);
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  // Reusable password input
  const PasswordInput = ({
    id,
    label,
    value,
    onChange,
    show,
    setShow,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    show: boolean;
    setShow: (v: boolean) => void;
  }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-[#8B5E3C] mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full p-2.5 pr-10 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
          required
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label={show ? "Hide" : "Show"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#3D1902] mb-2">⚙️ Settings</h1>
        <p className="text-sm text-[#8B5E3C]/60 mb-6">
          Manage your account and system preferences
        </p>

        <div className="space-y-6">
          {/* ── Change Password ── */}
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

            <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
              <PasswordInput
                id="current-pw"
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                show={showCurrent}
                setShow={setShowCurrent}
              />
              <PasswordInput
                id="new-pw"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                setShow={setShowNew}
              />
              <PasswordInput
                id="confirm-pw"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                show={showConfirm}
                setShow={setShowConfirm}
              />
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all"
              >
                {saving ? "Saving..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* ── Notification Preferences ── */}
          <div className="bg-white rounded-2xl border border-[#8B5E3C]/10 shadow-sm p-6">
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
                  className="w-5 h-5 accent-[#8B5E3C]"
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
                  className="w-5 h-5 accent-[#8B5E3C]"
                />
              </label>
            </div>
          </div>

          {/* ── System Info ── */}
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
              <p>• Built with Next.js, Prisma & PostgreSQL by Mary Umoize</p>
              <p>• Secured with JWT authentication</p>
              <p>• © {new Date().getFullYear()} The Benedictine Academy</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/admin-portal/dashboard")}
          className="w-full mt-6 py-3 text-sm font-bold text-[#8B5E3C] hover:text-[#3D1902] transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}