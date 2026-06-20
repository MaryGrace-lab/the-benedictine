import React from 'react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <div className="mt-12 md:mt-16 text-center p-8 md:p-12 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
      <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-2">
        Still have questions?
      </h3>
      <p className="text-slate-500 mb-8 font-sans">
        Our admissions team is always ready to help you.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center justify-center bg-[#270f01] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#3d1902] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#270f01]/20 text-sm md:text-base"
      >
        Get in Touch Now
      </Link>
    </div>
  );
}