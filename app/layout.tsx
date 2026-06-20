// ──────────────────────────────────────────────
// Root Layout — Server Component
// ──────────────────────────────────────────────

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Benedictine Academy",
    template: "%s — The Benedictine Academy",
  },
  description:
    "Catholic Education Centre - Nurturing Minds, Building Character. Check your academic results online.",
  keywords: ["school", "results", "The Benedictine Academy", "Benin City", "education", "Catholic school"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#FAF7F2] text-[#3D1902] antialiased`}>
        {children}
      </body>
    </html>
  );
}