import React from 'react';

interface HeroSectionProps {
  children: React.ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className="relative py-16 md:py-24 bg-[#270f01] overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {children}
      </div>
    </section>
  );
}