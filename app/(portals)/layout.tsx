// ──────────────────────────────────────────────
// Portals Root Layout — Server Component
// General layout for all portals (admin, teacher, student).
// Individual portals have their own layouts with sidebars.
// ──────────────────────────────────────────────

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "The Benedictine Academy Portal",
    template: "%s — The Benedictine Academy",
  },
  description: "Student result management system for The Benedictine Academy.",
};

export default function PortalsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]">
      {children}
    </div>
  );
}