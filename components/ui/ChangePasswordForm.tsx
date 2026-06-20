"use client";

// ──────────────────────────────────────────────
// Change Password Form — Reusable Client Component
// Used by Admin, Teacher, and Student portals.
// Includes show/hide password toggle on all fields.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  role: "student" | "admin" | "teacher";
  redirectTo: string;
};

export default function ChangePasswordForm({ role, redirectTo }: Props) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle states for each password field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password changed! Please login again.");
        await fetch(`/api/auth/${role}-logout`, { method: "POST" });
        setTimeout(() => router.push(redirectTo), 1500);
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-600 mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full p-3 pr-12 border rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-600 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 characters)"
            className="w-full p-3 pr-12 border rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full p-3 pr-12 border rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#270f01] text-white rounded-lg font-semibold hover:bg-[#3d1902] disabled:opacity-50 transition-all"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}