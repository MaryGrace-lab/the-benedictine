"use client";

// ──────────────────────────────────────────────
// Admin Login Page — Client Component
// Handles admin authentication with loading state.
// Includes show/hide password toggle.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome back!");
        router.push("/admin-portal/dashboard");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        {/* Logo */}
        <Image
          src="/logo.jpg"
          alt="School Logo"
          width={64}
          height={64}
          className="mx-auto mb-4 rounded-full"
        />

        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Admin Portal
        </h1>
        <p className="text-center text-slate-500 text-sm mb-6">
          Sign in to manage students and results
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
              required
              autoComplete="email"
            />
          </div>

          {/* Password with toggle */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#270f01] text-white rounded-lg font-semibold hover:bg-[#3d1902] disabled:opacity-50 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Back to Home */}
        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-[#8B5E3C]/60 hover:text-[#8B5E3C] font-medium">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}