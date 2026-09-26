"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function UnlockResultsPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      toast.error("Please enter your PIN");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Unlocked!");
        router.push("/student-portal/results");
        router.refresh();
      } else {
        // Show the exact message from the API
        toast.error(data.error || "Incorrect PIN", { duration: 5000 });
        // Clear the input on wrong PIN so the student can retype
        if (res.status === 401) {
          setPin("");
        }
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center border border-[#8B5E3C]/10">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-[#8B5E3C]" />
        </div>
        <h1 className="text-xl font-bold text-[#3D1902] mb-2">Enter Result PIN</h1>
        <p className="text-sm text-[#8B5E3C]/70 mb-6">
          Your PIN is printed on your student card. It protects your results.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            pattern="\d*"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="• • • •"
            maxLength={6}
            className="w-full text-center tracking-[0.5em] text-2xl font-mono p-4 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 focus:border-[#8B5E3C]"
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !pin.trim()}
            className="w-full py-3 bg-[#8B5E3C] text-white rounded-lg font-semibold hover:bg-[#6B3F2C] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Unlock Results"
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Forgot your PIN? Contact the school office on +234 705 944 3788.
        </p>
      </div>
    </div>
  );
}