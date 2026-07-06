"use client";

import { useState, useEffect } from "react";
import { X, Star, Share } from "lucide-react";

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

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [os, setOs] = useState<"android" | "ios" | "other">("other");

  useEffect(() => {
    setOs(getOS());

    // On iOS, always show the guidance card after a short delay (no beforeinstallprompt)
    if (getOS() === "ios") {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }

    // On Android, wait for the beforeinstallprompt event
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
    // Keep visible even after install attempt
  };

  if (!visible) return null;

  // iOS: show guidance (always visible, X closes it until page reload)
  if (os === "ios") {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl border border-gray-200 animate-in slide-in-from-bottom">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#1B3A5C] to-[#8B5E3C] flex items-center justify-center text-xl font-bold text-white">
            TBA
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">
              Install The Benedictine Academy
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tap <Share className="inline h-3 w-3" /> then <strong>“Add to Home Screen”</strong>.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Android / Chrome: modern card – always visible after event fires, X closes it
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl border border-gray-200 animate-in slide-in-from-bottom">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#1B3A5C] to-[#8B5E3C] flex items-center justify-center text-2xl font-bold text-white shadow-md">
          TBA
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-base truncate">
            The Benedictine Academy
          </p>
          <p className="text-xs text-gray-500">Education · Portal access · Free</p>
          <div className="mt-1 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-xs font-medium text-gray-600">4.9</span>
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              Safe
            </span>
          </div>
        </div>
        <button
          onClick={handleInstall}
          className="flex-shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
        >
          Install
        </button>
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 text-gray-500 hover:bg-gray-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}