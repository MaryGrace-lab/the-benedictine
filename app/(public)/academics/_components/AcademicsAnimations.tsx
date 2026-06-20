"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { CurriculumSection as CurriculumSectionType } from '../_types/academics';
import CTASection from './CTASection';
import HeroSection from './HeroSection';
import CurriculumSection from './CurriculumSection';

// ──────────── Page Layout (scroll behaviour) ────────────
export function AcademicsPageContent({
  sections,
}: {
  sections: CurriculumSectionType[];
}) {
  const programsRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <HeroSection scrollToRef={programsRef} />

      <div ref={programsRef}>
        {sections.map((section, index) => (
          <CurriculumSection
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </div>

      <CTASection />
    </main>
  );
}

// ──────────── Hero Animations ────────────
export function AnimatedHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="max-w-3xl"
    >
      {/* Badge */}
      <div className="flex items-center gap-3 mb-8" aria-hidden="true">
        <span className="h-0.5 w-12 bg-amber-500" />
        <span className="text-amber-400 font-semibold tracking-[0.3em] uppercase text-xs">
          Tradition & Excellence
        </span>
      </div>

      <h1 className="text-6xl md:text-8xl font-serif font-medium text-stone-50 mb-8 leading-[1.1]">
        Nurturing <span className="italic text-amber-500">Minds</span>,
        <br />
        Building <span className="text-stone-300">Legacy</span>
      </h1>

      <p className="text-xl text-stone-300 leading-relaxed max-w-xl font-light mb-10">
        A comprehensive curriculum rooted in values, designed to inspire the next
        generation of global leaders.
      </p>
    </motion.div>
  );
}

export function ScrollToProgramsButton({
  programsRef,
}: {
  programsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const scrollToPrograms = () => {
    programsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={scrollToPrograms}
      className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-all flex items-center gap-2 shadow-xl shadow-black/20"
    >
      Explore Programs
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}

// ──────────── Curriculum Section Animations ────────────
export function AnimatedCurriculumText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCurriculumImageCard({
  image,
  title,
  index,
}: {
  image: string;
  title: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex-1 w-full relative"
    >
      <div className="relative z-10 group">
        {/* Decorative border */}
        <div
          className="absolute -inset-4 border border-stone-200 rounded-2xl -z-10 transition-transform duration-700 group-hover:scale-105"
          aria-hidden="true"
        />

        {/* Image Container */}
        <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-xl shadow-2xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors"
            aria-hidden="true"
          />
        </div>

        {/* Decorative badge */}
        <div
          className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl rounded-lg hidden md:block"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full text-amber-700">
              <Star className="w-5 h-5 fill-current" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase font-bold tracking-widest">
                Accredited
              </p>
              <p className="text-sm font-serif font-bold text-stone-800">
                Global Standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}