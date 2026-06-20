import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative bg-[#270f01] py-20 md:py-28 overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#d4af37_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#d4af37_0%,transparent_50%)]" />
      </div>

      <div className="relative container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
          Admissions
        </h1>
        <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Join a community of excellence. All applications are processed{' '}
          <span className="text-amber-400 font-semibold">in person</span> at the school.
        </p>
      </div>
    </section>
  );
}