"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs, FAQItem } from './_data/faqs';
import HeroSection from './_components/HeroSection';
import CTASection from './_components/CTASection';

// ----------------- Accordion Item -----------------
function AccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group border border-slate-200 rounded-2xl bg-white hover:border-[#d4af37]/40 transition-all duration-300 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => onToggle(index)}
        onKeyDown={handleKeyDown}
        className="w-full px-5 py-5 md:px-8 md:py-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 rounded-2xl"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-button-${index}`}
      >
        <span className="font-heading font-bold text-slate-800 text-lg md:text-xl pr-4 leading-snug">
          {faq.q}
        </span>
        <div
          className={`shrink-0 p-2 rounded-full transition-colors ${
            isOpen ? 'bg-[#d4af37]/10' : 'bg-slate-100'
          }`}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-500 ${
              isOpen ? 'rotate-180 text-[#d4af37]' : 'text-slate-500'
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-button-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-5 pb-6 md:px-8 md:pb-8 text-slate-600 text-sm md:text-base border-t border-slate-50 pt-4 leading-relaxed font-sans">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ----------------- Page Component -----------------
export default function FAQPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Hero – wrap server component in motion for entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
      </motion.div>

      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* CTA – wrap in motion for scroll reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CTASection />
          </motion.div>
        </div>
      </section>
    </main>
  );
}