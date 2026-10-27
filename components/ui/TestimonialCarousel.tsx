// components/ui/TestimonialCarousel.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import type { HomeTestimonial } from '@/app/(public)/_data/homepage';

interface TestimonialCarouselProps {
  testimonials: HomeTestimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (testimonials.length === 0) return;
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (testimonials.length === 0) return null;

  return (
    <div
      className="relative max-w-2xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10"
        >
          <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
            {[...Array(5)].map((_, s) => (
              <Star
                key={s}
                className="w-5 h-5 fill-[#eab308] text-[#eab308]"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-white/90 text-base md:text-lg italic leading-relaxed">
            “{testimonials[currentIndex].content}”
          </p>
          <div className="mt-6">
            <p className="font-semibold text-white text-lg">
              {testimonials[currentIndex].name}
            </p>
            <p className="text-sm text-white/60">{testimonials[currentIndex].role}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-[#eab308]'
                : 'w-2.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}