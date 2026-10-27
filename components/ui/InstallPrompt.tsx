"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Star, Share, Clock } from "lucide-react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function getOS(): "android" | "ios" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return "other";
}

// Portal login paths where the install prompt should appear
const PORTAL_LOGIN_PATHS = [
  "/admin-portal/login",
  "/student-portal/login",
  "/teacher-portal/login",
];

export default function InstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [os, setOs] = useState<"android" | "ios" | "other">("other");
  const [isStandalone, setIsStandalone] = useState(false);
  const [remindLater, setRemindLater] = useState(false);

  // Check if app is already installed (standalone mode)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    }
  }, []);

  // Check reminder storage
  useEffect(() => {
    const reminder = localStorage.getItem('install_prompt_reminder');
    if (reminder) {
      const remindTime = parseInt(reminder, 10);
      const now = Date.now();
      if (now - remindTime < 24 * 60 * 60 * 1000) {
        setRemindLater(true);
      } else {
        localStorage.removeItem('install_prompt_reminder');
      }
    }
  }, []);

  const isPortalLoginPage = PORTAL_LOGIN_PATHS.some((path) =>
    pathname?.startsWith(path.replace("/login", ""))
  );

  // Hide if not on portal, or standalone, or reminded later
  if (!isPortalLoginPage || isStandalone || remindLater) return null;

  useEffect(() => {
    setOs(getOS());

    if (getOS() === "ios") {
      // Show after 1 second on iOS (faster than 2s)
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    // Keep visible even after install attempt (user may dismiss)
  };

  const handleRemindLater = () => {
    localStorage.setItem('install_prompt_reminder', Date.now().toString());
    setRemindLater(true);
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  // ─── iOS: guidance card ──────────────────────────────
  if (os === "ios") {
    return (
      <div className="fixed bottom-32 md:bottom-6 left-4 right-4 z-40 mx-auto max-w-sm md:max-w-md rounded-2xl bg-white p-3 md:p-4 shadow-2xl border border-gray-200 animate-in slide-in-from-bottom">
        <div className="flex items-start gap-2 md:gap-3">
        <div className="h-10 w-10 md:h-14 md:w-14 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/icons/icon-192x192.png" // or /icons/icon-192x192.png
            alt="The Benedictine Academy"
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
              Install The Benedictine Academy
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
              Tap <Share className="inline h-3 w-3" /> then <strong>“Add to Home Screen”</strong>.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={handleRemindLater}
              className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <Clock className="h-3 w-3" /> Remind later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Android / Chrome: install card ──────────────────
  return (
    <div className="fixed bottom-32 md:bottom-6 left-4 right-4 z-40 mx-auto max-w-sm md:max-w-md rounded-2xl bg-white p-3 md:p-4 shadow-2xl border border-gray-200 animate-in slide-in-from-bottom">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Logo */}
        <div className="h-10 w-10 md:h-14 md:w-14 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/icons/icon-192x192.png" // or /icons/icon-192x192.png
            alt="The Benedictine Academy"
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-xs sm:text-sm md:text-base truncate">
            The Benedictine Academy
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">Education · Portal access · Free</p>
          <div className="mt-0.5 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-0.5 text-[10px] md:text-xs font-medium text-gray-600">4.9</span>
            <span className="ml-1 hidden xs:inline rounded-full bg-green-100 px-1.5 py-0.5 text-[8px] md:text-[10px] font-semibold text-green-700">
              Safe
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleInstall}
            className="flex-shrink-0 rounded-xl bg-blue-600 px-3 py-1.5 md:px-5 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            Install
          </button>
          <button
            onClick={handleRemindLater}
            className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <Clock className="h-3 w-3" /> Remind later
          </button>
        </div>

        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 md:-top-2.5 md:-right-2.5 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>
      </div>
    </div>
  );
}