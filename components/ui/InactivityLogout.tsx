"use client";

// ──────────────────────────────────────────────
// Inactivity Logout — Client Component
// Logs the student out after 15 minutes of no activity.
// Resets the timer on any mouse / keyboard / touch / scroll activity.
// ──────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function InactivityLogout() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    const logout = async () => {
      // Prevent double-firing
      if (isLoggingOut.current) return;
      isLoggingOut.current = true;

      try {
        await fetch("/api/auth/student-logout", { method: "POST" });
      } catch {
        // Ignore network errors — still redirect
      }

      toast.error("You have been logged out due to inactivity.", {
        duration: 5000,
      });
      router.push("/student-portal/login");
      router.refresh();
    };

    const resetTimer = () => {
      if (isLoggingOut.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logout, TIMEOUT_MS);
    };

    // Start the timer
    resetTimer();

    // Activity events that reset the timer
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ] as const;

    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [router]);

  return null;
}