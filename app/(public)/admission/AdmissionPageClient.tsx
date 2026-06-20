"use client";

import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './_components/HeroSection';
import PhysicalApplicationNotice from './_components/PhysicalApplicationNotice';
import AdmissionRequirements from './_components/AdmissionRequirements';
import ApplicationGuidelines from './_components/ApplicationGuidelines';
import CTASection from './_components/CTASection';
import { useReducedMotion } from 'framer-motion';

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export default function AdmissionPageClient() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] text-stone-800">
      <HeroSection />
      <AnimatedSection>
        <PhysicalApplicationNotice />
      </AnimatedSection>
      <AnimatedSection>
        <AdmissionRequirements />
      </AnimatedSection>
      <AnimatedSection>
        <ApplicationGuidelines />
      </AnimatedSection>
      <AnimatedSection>
        <CTASection />
      </AnimatedSection>
    </main>
  );
}