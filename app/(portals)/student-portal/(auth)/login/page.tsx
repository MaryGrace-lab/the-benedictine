"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import InstallPrompt from "@/components/ui/InstallPrompt";

export default function StudentLoginPage() {
  const router = useRouter();
  const [schoolId, setSchoolId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSchoolId = schoolId.trim();
    const trimmedStudentId = studentId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedSchoolId || !trimmedStudentId || !trimmedPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: trimmedSchoolId,
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
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
            Enter your School ID, Card ID and password
          </p>

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {/* School ID */}
            <div>
              <label htmlFor="school-id" className="block text-sm font-medium text-slate-600 mb-1">
                School ID
              </label>
              <input
                id="school-id"
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="e.g. TBA/2026/0123"
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] transition-all"
                required
                autoComplete="off"
                disabled={loading}
              />
            </div>

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
                placeholder="e.g. TBA/STU/2026/001"
                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C] transition-all"
                required
                autoComplete="username"
                disabled={loading}
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

          <p className="text-center mt-6 text-xs text-slate-400">
            Forgot your password? Contact the school office on{" "}
            <a href="tel:+2347059443788" className="underline hover:text-slate-600">
              +234 705 944 3788
            </a>
          </p>

          <p className="text-center mt-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}