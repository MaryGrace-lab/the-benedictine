// ──────────────────────────────────────────────
// Root Layout — Server Component
// ──────────────────────────────────────────────

// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PageTransition from "@/components/PageTransition";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Benedictine Academy — Catholic Education Centre",
    template: "%s | The Benedictine Academy",
  },
  description:
    "The Benedictine Academy — Catholic Education Centre in Benin City, Edo State. ✓ Check exam results online ✓ Report cards ✓ Admission for next academic session is now open. Learning in Wisdom.",
  keywords: [
    // School name
    "The Benedictine Academy",
    "Benedictine Academy",
    "TBA Benin City",
    
    // Location
    "Benin City",
    "Edo State",
    "Nigeria",
    
    // Education type
    "Catholic school",
    "Catholic education centre",
    "Catholic nursery and primary school",
    "Catholic secondary school",
    
    // Services
    "school results",
    "result checker",
    "student portal",
    "academic results",
    "report cards",
    "exam scores",
    
    // Admission
    "school admission",
    "admission open",
    "school fees",
    "academic calendar",
    
    // Programs
    "nursery education",
    "primary education",
    "secondary education",
    "holistic education",
    
    // Brand
    "Learning in Wisdom",
    "excellence and character",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Benedictine",
    statusBarStyle: "black-translucent",
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
  twitter: {
    card: "summary_large_image",
    title: "The Benedictine Academy — Catholic Education Centre",
    description:
      "Official student result management portal for The Benedictine Academy, Benin City.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B3A5C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#FAF7F2] text-[#3D1902] antialiased`}>
        <StructuredData />
        <ServiceWorkerRegistration />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}