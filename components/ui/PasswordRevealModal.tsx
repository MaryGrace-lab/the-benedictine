//components/ui/PasswordRevealModal.tsx
"use client";

import React, { useState } from "react";
import { Loader2, Copy, Check, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  studentId: string;
  studentName: string;
  onClose: () => void;
};

export default function PasswordRevealModal({ isOpen, studentId, studentName, onClose }: Props) {
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fetchPassword = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/students/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      const data = await res.json();

      if (res.ok) {
        setPassword(data.password);
        setRevealed(true);
      } else {
        setError(data.error || "Failed to retrieve password");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        toast.success("Password copied!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy");
      }
    }
  };

  const handleClose = () => {
    setRevealed(false);
    setPassword(null);
    setError("");
    setCopied(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">🔑</span>
        </div>

        <h2 className="text-xl font-bold text-center text-[#3D1902] mb-2">
          Student Password
        </h2>
        <p className="text-center text-sm text-[#8B5E3C]/70 mb-4">
          {studentName}
        </p>

        <div className="bg-[#FAF7F2] rounded-xl p-4 mb-4 text-center">
          {!revealed ? (
            <div>
              <p className="text-sm text-[#8B5E3C] mb-3">
                This shows the auto-generated password for this student.
              </p>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 text-left">
                  The student may have changed their password. This only shows the original auto-generated one.
                  For a guaranteed working password, use "Reset Password" instead.
                </p>
              </div>
              <button
                onClick={fetchPassword}
                disabled={loading}
                className="px-6 py-2 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Reveal Password"
                )}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-[#8B5E3C]/60 mb-2">Auto-generated password:</p>
              <div className="flex items-center justify-center gap-2">
                <code className="bg-white px-4 py-2 rounded-lg text-lg font-bold text-[#3D1902] font-mono select-all">
                  {password}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-[#8B5E3C]/10 rounded-lg hover:bg-[#8B5E3C]/20 transition-all flex-shrink-0"
                  aria-label="Copy password"
                >
                  {copied ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-[#8B5E3C]" />
                  )}
                </button>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">
                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 text-left">
                  If this password doesn't work, the student has changed it. Use "Forgot Password" on the student login page.
                </p>
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <button
          onClick={handleClose}
          className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}