"use client";

// ──────────────────────────────────────────────
// Student Login Page — Client Component
// Login form with forgot password flow.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

type ResetResult = {
  success: boolean;
  studentName: string;
  password: string;
  studentId: string;
} | null;

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot Password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStudentId, setForgotStudentId] = useState("");
  const [forgotLastName, setForgotLastName] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetResult, setResetResult] = useState<ResetResult>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        router.push("/student-portal/dashboard");
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setResetResult(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: forgotStudentId, lastName: forgotLastName }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetResult(data);
        toast.success("Password reset successful!");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    const recoveredId = resetResult?.studentId || forgotStudentId;
    setShowForgot(false);
    setResetResult(null);
    setForgotStudentId("");
    setForgotLastName("");
    setStudentId(recoveredId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Toaster position="top-center" />

      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        {!showForgot ? (
          <>
            {/* Logo */}
            <Image
              src="/logo.jpg"
              alt="School Logo"
              width={64}
              height={64}
              className="mx-auto mb-4 rounded-full"
            />

            <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
              Student Portal
            </h1>
            <p className="text-center text-slate-500 text-sm mb-6">
              Enter your Card ID and password to view results
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Card ID */}
              <div>
                <label htmlFor="card-id" className="block text-sm font-medium text-slate-600 mb-1">
                  Card ID
                </label>
                <input
                  id="card-id"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. BA-2025-0001"
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-3 pr-12 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#270f01] text-white rounded-lg font-semibold hover:bg-[#3d1902] disabled:opacity-50 transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Forgot Password Link */}
            <p className="text-center mt-4">
              <button
                onClick={() => setShowForgot(true)}
                className="text-sm text-[#8B5E3C] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </p>

            {/* Back to Home */}
            <p className="text-center mt-2">
              <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
                ← Back to Home
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
              Forgot Password
            </h1>
            <p className="text-center text-slate-500 text-sm mb-6">
              Enter your Card ID and Last Name to reset your password
            </p>

            {resetResult ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-700 font-semibold mb-2">✅ Password Reset!</p>
                <p className="text-sm text-slate-600 mb-1">
                  Student: <strong>{resetResult.studentName}</strong>
                </p>
                <p className="text-sm text-slate-600 mb-3">New Password:</p>
                <code className="bg-white px-4 py-2 rounded-lg text-lg font-bold text-[#3D1902] font-mono">
                  {resetResult.password}
                </code>
                <p className="text-xs text-slate-400 mt-3">
                  Your password has been reset to the original. Use this to login.
                </p>
                <button
                  onClick={handleBackToLogin}
                  className="mt-4 px-6 py-2 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] transition-all"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-studentId" className="block text-sm font-medium text-slate-600 mb-1">
                    Card ID
                  </label>
                  <input
                    id="forgot-studentId"
                    type="text"
                    value={forgotStudentId}
                    onChange={(e) => setForgotStudentId(e.target.value)}
                    placeholder="e.g. BA-2025-0001"
                    className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="forgot-lastName" className="block text-sm font-medium text-slate-600 mb-1">
                    Last Name
                  </label>
                  <input
                    id="forgot-lastName"
                    type="text"
                    value={forgotLastName}
                    onChange={(e) => setForgotLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
                >
                  ← Back to Login
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}