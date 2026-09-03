// components/ui/AnnouncementBar.tsx
"use client";

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Bell, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export default function AnnouncementBar({ text, linkText, linkHref }: AnnouncementBarProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="bg-[#eab308] py-2.5 px-4 border-b border-black/5">
      <div className="container mx-auto flex items-center justify-center gap-3 text-[#270f01]">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="shrink-0"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
        </motion.div>
        <p className="text-xs md:text-sm font-bold font-sans text-center leading-tight">
          <span className="uppercase tracking-wider mr-2 bg-[#270f01] text-white px-1.5 py-0.5 rounded text-[9px] md:text-[10px]">
            Notice
          </span>
          {text}
        </p>
        <Link
          href={linkHref}
          className="hidden sm:flex items-center gap-1 text-[10px] md:text-xs font-black uppercase tracking-wider hover:underline ml-2"
        >
          {linkText} <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}