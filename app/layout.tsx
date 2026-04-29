import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utilis";

const jetbrainsMonoHeading = JetBrains_Mono({subsets:['latin'],variable:'--font-heading'});
const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Benedictine Academy",
  description: "Catholic Education Centre - Nurturing Minds, Building Character",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable, jetbrainsMonoHeading.variable)}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}