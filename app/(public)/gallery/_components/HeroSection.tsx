import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative py-24 bg-[#270f01] overflow-hidden">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay">
        <Image
          src="/1.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-[#eab308]">Gallery</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Glimpses of life, achievements, and the vibrant community at The Benedictine Academy.
          </p>
        </div>
      </div>
    </section>
  );
}