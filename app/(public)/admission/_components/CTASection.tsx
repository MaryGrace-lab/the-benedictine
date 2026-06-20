import React from 'react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl shadow-xl border border-stone-100 p-10 md:p-14">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#270f01] mb-4">
          Ready to Apply?
        </h2>
        <p className="text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">
          Visit our school to pick up an application form and begin the admission process.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-10 py-4 bg-[#270f01] text-white font-semibold rounded-full hover:bg-[#3d1902] transition-colors shadow-lg"
        >
          Contact Us for Directions
        </Link>
      </div>
    </section>
  );
}