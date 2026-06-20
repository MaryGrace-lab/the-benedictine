import React from 'react';
import Image from 'next/image';
import { AnimatedHero, ScrollToProgramsButton } from './AcademicsAnimations';

interface HeroSectionProps {
  scrollToRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ scrollToRef }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-[#2C1810]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slide-1.jpg"
          alt=""
          fill
          className="object-cover opacity-30 scale-105"
          priority
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#2C1810] via-[#2C1810]/80 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedHero />

          <ScrollToProgramsButton programsRef={scrollToRef} />

      </div>

      {/* Gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFCFB] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}