"use client";

import { useRouter } from "next/navigation";

/**
 * BackButton - A reusable navigation button component.
 * 
 * Must be a client component because it uses the useRouter hook
 * for client-side navigation without full page reloads.
 * 
 * @param href  - The destination path (e.g., "/admin-portal/dashboard")
 * @param label - The text to display on the button
 */
export default function BackButton({ href, label }: { href: string; label: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="w-full mt-4 py-3 text-slate-600 hover:text-slate-800 font-medium text-sm"
      aria-label={label}
    >
      ← {label}
    </button>
  );
}