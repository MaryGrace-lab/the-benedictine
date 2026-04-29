"use client";

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Link from 'next/link';

type FAQItem = {
  q: string;
  a: ReactNode;
};

const faqs: FAQItem[] = [
  { q: 'What are the admission requirements?', a: 'Applicants must submit completed application forms, birth certificate, previous school reports, immunization records, and passport photographs. An entrance examination and interview are also required.' },
  { 
    q: 'What is the school fee structure?', 
    a: (
      <span>
        Fees vary by class level. Please{' '}
        <Link 
          href="/contact" 
          className="text-[#270f01] underline font-semibold hover:text-[#b08d2a] transition-colors"
        >
          contact the admissions office
        </Link>{' '}
        or reach out via{' '}
        <a 
          href="https://wa.me/2347059443788"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-green-600 underline font-semibold"
        >
          WhatsApp <MessageCircle className="w-3 h-3" />
        </a>{' '}
        for the current fee schedule. Payment plans are available.
      </span>
    ) 
  },
  { q: 'Do you offer boarding facilities?', a: 'Currently, The Benedictine Academy operates as a day school.' },
  { q: 'What extracurricular activities are available?', a: 'We offer a wide range including football, martial arts, debate competition, drama, coding club, music, art, and catering services.' },
  { q: 'How can I track my child\'s academic progress?', a: 'Parents can access the student portal to view results, attendance records, and teacher comments. We also hold termly parent-teacher meetings.' },
  { q: 'What is the student-to-teacher ratio?', a: 'We maintain a maximum ratio of 20:1 to ensure personalized attention and effective learning for every student.' },
  { q: 'Is transportation provided?', a: 'Yes, we operate school buses covering major routes across the city. Bus service fees are separate from tuition fees.' },
  { q: 'What curriculum does the school follow?', a: 'We follow the Nigerian National Curriculum accredited by the Ministry of Education, supplemented with international best practices in STEM and humanities.' },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Hero Section - Matched to Contact Us Style */}
      <section className="bg-[#270f01] py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
          >
            Frequently Asked <span className="text-[#d4af37]">Questions</span>
          </motion.h1>
          <p className="text-lg opacity-80 max-w-2xl">
            Find answers to common questions about The Benedictine Academy
          </p>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group border border-slate-200 rounded-2xl bg-white hover:border-[#d4af37]/40 transition-all duration-300 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-5 py-5 md:px-8 md:py-6 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-heading font-bold text-slate-800 text-lg md:text-xl pr-4 leading-snug">
                    {faq.q}
                  </span>
                  <div className={`shrink-0 p-2 rounded-full transition-colors ${openIndex === i ? 'bg-[#d4af37]/10' : 'bg-slate-100'}`}>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-500 ${
                        openIndex === i ? 'rotate-180 text-[#d4af37]' : 'text-slate-500'
                      }`} 
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
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
            ))}
          </div>

          {/* Call to Action - Matched Card Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16 text-center p-8 md:p-12 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-2">Still have questions?</h3>
            <p className="text-slate-500 mb-8 font-sans">Our admissions team is always ready to help you.</p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center bg-[#270f01] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#3d1902] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#270f01]/20 text-sm md:text-base"
            >
              Get in Touch Now
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;