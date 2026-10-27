// components/ui/HighlightsSection.tsx
"use client";

import { motion } from 'framer-motion';
import type { HomeHighlight } from '@/app/(public)/_data/homepage';

interface HighlightsSectionProps {
  highlights: HomeHighlight[];
}

export default function HighlightsSection({ highlights }: HighlightsSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Why Choose The Benedictine Academy?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our academy a premier institution for holistic education
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px -8px rgba(234, 179, 8, 0.3), 0 0 60px -12px rgba(234, 179, 8, 0.15)",
                borderColor: "rgba(234, 179, 8, 0.5)",
              }}
              className="text-center p-6 rounded-xl bg-card shadow-card border-2 border-transparent hover:border-[#eab308]/50 transition-all"
            >
              <div className="text-4xl mb-4" aria-hidden="true">
                {h.icon}
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{h.title}</h3>
              <p className="text-sm text-muted-foreground">{h.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}