// app/(public)/HomePageClient.tsx
"use client";

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Import all components
import AnnouncementBar from '@/components/ui/AnnouncementBar';
import HeroSection from '@/components/ui/HeroSection';
import LogoShowcase from '@/components/ui/LogoShowcase';
import AnnouncementsSection from '@/components/ui/AnnouncementsSection';
import HighlightsSection from '@/components/ui/HighlightsSection';
import GallerySection from '@/components/ui/GallerySection';
import TestimonialCarousel from '@/components/ui/TestimonialCarousel';
import CTASection from '@/components/ui/CTASection';
import { galleryImages } from './_data/homepage';
import type {
  HomeStat,
  HomeAnnouncement,
  HomeHighlight,
  HomeTestimonial,
} from './_data/homepage';

// Lazy load InstallPrompt
const InstallPrompt = dynamic(
  () => import('@/components/ui/InstallPrompt'),
  { ssr: false }
);

interface HomePageClientProps {
  stats: HomeStat[];
  announcements: HomeAnnouncement[];
  highlights: HomeHighlight[];
  testimonials: HomeTestimonial[];
}

export default function HomePageClient({
  stats,
  announcements,
  highlights,
  testimonials,
}: HomePageClientProps) {
  const shouldReduceMotion = useReducedMotion(); // returns boolean | null

  return (
    <>
      <InstallPrompt />
      <Toaster position="top-center" />

      <main className="flex-1 overflow-x-hidden" id="main-content">
        <AnnouncementBar
          text="Admissions are now open for the 2026/2027 academic year."
          linkText="Details"
          linkHref="/admission"
        />

        {/* ✅ Fix: convert null to false */}
        <HeroSection stats={stats} shouldReduceMotion={shouldReduceMotion ?? false} />

        <LogoShowcase />

        <AnnouncementsSection announcements={announcements} />

        <HighlightsSection highlights={highlights} />

        <GallerySection images={galleryImages} />

        {testimonials.length > 0 && (
          <section className="py-16 bg-[#270f01]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-display font-bold text-white text-center mb-12">
                What People Say
              </h2>
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </section>
        )}

        <CTASection />
      </main>
    </>
  );
}