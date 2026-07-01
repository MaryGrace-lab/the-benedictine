"use client";

// ──────────────────────────────────────────────
// Student Login Page — Client Component
// Login form with forgot password flow.
// Password is revealed with copy functionality and security warning.
// PWA install prompt included.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Copy, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import InstallPrompt from "@/components/ui/InstallPrompt";

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
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedStudentId = studentId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedStudentId || !trimmedPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: trimmedStudentId,
          password: trimmedPassword,
        }),
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

    const trimmedStudentId = forgotStudentId.trim();
    const trimmedLastName = forgotLastName.trim();

    if (!trimmedStudentId || !trimmedLastName) {
      toast.error("Please fill in all fields");
      return;
    }

    setForgotLoading(true);
    setResetResult(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: trimmedStudentId,
          lastName: trimmedLastName,
        }),
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

  const handleCopyPassword = async () => {
    if (resetResult?.password) {
      try {
        await navigator.clipboard.writeText(resetResult.password);
        setPasswordCopied(true);
        toast.success("Password copied to clipboard!");
        setTimeout(() => setPasswordCopied(false), 2000);
      } catch {
        toast.error("Failed to copy. Please copy manually.");
      }
    }
  };

  const handleBackToLogin = () => {
    const recoveredId = resetResult?.studentId || forgotStudentId;
    setShowForgot(false);
    setResetResult(null);
    setForgotStudentId("");
    setForgotLastName("");
    setStudentId(recoveredId);
    setPasswordCopied(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/1.jpg"
          alt="School background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#3D1902",
            border: "1px solid #8B5E3C20",
          },
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        <InstallPrompt />

        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          {!showForgot ? (
            <>
              <Image
                src="/logo.jpg"
                alt="School Logo"
                width={64}
                height={64}
                className="mx-auto mb-4 rounded-full"
                priority
              />

              <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
                Student Portal
              </h1>
              <p className="text-center text-slate-500 text-sm mb-6">
                Enter your Card ID and password to view results
              </p>

              <form onSubmit={handleLogin} className="space-y-4" noValidate>
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
                    className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] transition-all"
                    required
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>

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
                      className="w-full p-3 pr-12 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] transition-all"
                      required
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <p className="text-center mt-4">
                <button
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-[#8B5E3C] hover:underline font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </p>

              <p className="text-center mt-2">
                <Link
                  href="/"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
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
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <p className="text-green-700 font-semibold text-lg mb-3">
                    ✅ Password Reset Successful!
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    Student: <strong>{resetResult.studentName}</strong>
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-3 border border-green-100">
                    <p className="text-xs text-slate-500 mb-2">
                      Your temporary password is:
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-xl font-bold text-[#3D1902] font-mono tracking-wider select-all">
                        {resetResult.password}
                      </code>
                      <button
                        onClick={handleCopyPassword}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Copy password"
                      >
                        {passwordCopied ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} className="text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-red-500 font-medium mb-4">
                    ⚠️ Change this password immediately after logging in for security!
                  </p>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-3 bg-[#8B5E3C] text-white rounded-lg text-sm font-semibold hover:bg-[#6B3F2C] transition-all"
                  >
                    Go to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
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
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] transition-all"
                      required
                      disabled={forgotLoading}
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
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] transition-all"
                      required
                      disabled={forgotLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setResetResult(null);
                    }}
                    className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                  >
                    ← Back to Login
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}