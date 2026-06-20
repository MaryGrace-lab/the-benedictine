import React from 'react';
import { AnimatedHero } from './AboutAnimations';

const HeroSection = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-[0.03] -z-10" />
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedHero />
      </div>
    </section>
  );
};

export default HeroSection;