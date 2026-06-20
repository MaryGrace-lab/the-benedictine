import React from 'react';

export default function HeroSection() {
  return (
    <section className="bg-[#270f01] py-20 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
          News & <span className="text-[#d4af37]">Events</span>
        </h1>
        <p className="text-lg opacity-80 max-w-2xl">
          Stay updated with the latest stories, achievements, and upcoming activities from The Benedictine Academy community.
        </p>
      </div>
    </section>
  );
}