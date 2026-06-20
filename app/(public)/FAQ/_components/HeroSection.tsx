import React from 'react';

export default function HeroSection() {
  return (
    <section className="bg-[#270f01] py-20 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
          Frequently Asked <span className="text-[#d4af37]">Questions</span>
        </h1>
        <p className="text-lg opacity-80 max-w-2xl">
          Find answers to common questions about The Benedictine Academy
        </p>
      </div>
    </section>
  );
}