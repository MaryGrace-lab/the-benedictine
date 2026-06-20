"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Clock } from 'lucide-react';

export default function ELearningPageClient() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#270f01]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Icon cluster */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="p-4 bg-amber-100 rounded-2xl shadow-sm">
            <BookOpen className="w-8 h-8 text-amber-700" />
          </div>
          <div className="p-4 bg-[#270f01]/5 rounded-2xl shadow-sm">
            <GraduationCap className="w-8 h-8 text-[#270f01]" />
          </div>
          <div className="p-4 bg-amber-100 rounded-2xl shadow-sm">
            <Clock className="w-8 h-8 text-amber-700" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#270f01] mb-6">
          E‑Learning Portal
        </h1>

        <div className="inline-block bg-amber-50 border border-amber-200 rounded-full px-6 py-2 mb-8">
          <span className="text-amber-800 font-semibold text-lg tracking-wide">
            Coming Soon
          </span>
        </div>

        <p className="text-stone-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          We are building an immersive online learning experience for our students. 
          Interactive lessons, assignments, and virtual classrooms will be available shortly.
        </p>

        <p className="text-stone-400 text-sm mt-8">
          Stay tuned for the launch date.
        </p>
      </motion.div>
    </main>
  );
}