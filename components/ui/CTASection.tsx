// components/ui/CTASection.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl shadow-xl p-8 md:p-12 text-center bg-gradient-to-br from-[#1B3A5C] via-[#eab308]/30 to-[#1B3A5C] animate-gradient border border-white/10">
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8 text-base md:text-lg">
              Take the first step towards a transformative educational experience. Applications for
              the new academic year are now open.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admission">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold shadow-lg shadow-[#eab308]/30"
                >
                  Start Application
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}