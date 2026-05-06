"use client";

import React, { useState } from 'react';
import HeroSection from './_components/HeroSection';
import AccordionItem from './_components/AccordionItem';
import CTASection from './_components/CTASection';
import { faqs } from './_data/faqs';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      <HeroSection />

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
          <CTASection />
        </div>
      </section>
    </main>
  );
};

export default FAQPage;