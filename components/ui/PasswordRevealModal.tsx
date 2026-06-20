"use client";

import React, { useState } from "react";
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

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
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
                This will reveal the auto-generated password for this student.
              </p>
              <p className="text-xs text-amber-600 mb-3">
                ⚠️ The student may have changed their password. This shows the original one.
              </p>
              <button
                onClick={fetchPassword}
                disabled={loading}
                className="px-6 py-2 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all"
              >
                {loading ? "Loading..." : "Reveal Password"}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-[#8B5E3C]/60 mb-2">Auto-generated password:</p>
              <div className="flex items-center justify-center gap-2">
                <code className="bg-white px-4 py-2 rounded-lg text-lg font-bold text-[#3D1902] font-mono">
                  {password}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-[#8B5E3C]/10 rounded-lg hover:bg-[#8B5E3C]/20 transition-all"
                  title="Copy to clipboard"
                  aria-label="Copy password to clipboard"
                >
                  📋
                </button>
              </div>
              <p className="text-xs text-amber-600 mt-3">
                ⚠️ Student may have changed this. If login fails, use "Forgot Password" or reset manually.
              </p>
            </div>
          )}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <button
          onClick={() => { onClose(); setRevealed(false); setPassword(null); }}
          className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}