"use client";

import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="bg-stone-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center border border-stone-200 p-12 rounded-3xl bg-white/50 backdrop-blur-sm">
        <h3 className="text-3xl font-serif mb-4">Ready to join our community?</h3>
        <p className="text-stone-600 mb-8">Admissions for the 2026/2027 academic session are now open.</p>
        <Link 
          href="/admission"
          className="px-10 py-4 border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728] hover:text-white transition-all rounded-full font-bold inline-block"
        >
          Start Your Application
        </Link>
      </div>
    </section>
  );
};

export default CTASection;