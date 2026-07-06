// ──────────────────────────────────────────────
// Root Layout — Server Component
// ──────────────────────────────────────────────

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Benedictine Academy — Catholic Education Centre",
    template: "%s — The Benedictine Academy",
  },
  description:
    "Official student result management portal for The Benedictine Academy, Benin City. Check academic results, report cards, and exam scores online. Catholic Education Centre — Learning in Wisdom.",
  keywords: [
    "The Benedictine Academy",
    "Benedictine Academy",
    "school results",
    "Benin City",
    "Catholic school",
    "result checker",
    "student portal",
    "academic results",
    "Edo State",
    "education",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.jpg",
  },
  manifest: "/manifest.json",   // ✅ ADD THIS
  appleWebApp: {                 // ✅ ADD THIS
    capable: true,
    title: "Benedictine",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "The Benedictine Academy — Student Result Portal",
    description:
      "Check your academic results online. The Benedictine Academy, Catholic Education Centre, Benin City.",
    url: "https://thebenedictineacademyportal.com",
    siteName: "The Benedictine Academy",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#FAF7F2] text-[#3D1902] antialiased`}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}