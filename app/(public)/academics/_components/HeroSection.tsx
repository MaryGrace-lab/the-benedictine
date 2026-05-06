"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  scrollToRef: React.RefObject<HTMLDivElement | null>;
}

const HeroSection = ({ scrollToRef }: HeroSectionProps) => {
  const scrollToPrograms = () => {
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-[#2C1810]">
      <div className="absolute inset-0 z-0">
        <img 
          src="/slide-1.jpg" 
          alt="Campus" 
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#2C1810] via-[#2C1810]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="h-0.5 w-12 bg-amber-500" />
            <span className="text-amber-400 font-semibold tracking-[0.3em] uppercase text-xs">
              Tradition & Excellence
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-medium text-stone-50 mb-8 leading-[1.1]">
            Nurturing <span className="italic text-amber-500">Minds</span>,<br /> 
            Building <span className="text-stone-300">Legacy</span>
          </h1>
          
          <p className="text-xl text-stone-300 leading-relaxed max-w-xl font-light mb-10">
            A comprehensive curriculum rooted in values, designed to inspire the next generation of global leaders.
          </p>

          <div className="flex gap-4">
            <button 
              onClick={scrollToPrograms}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-all flex items-center gap-2 shadow-xl shadow-black/20"
            >
              Explore Programs <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#FDFCFB] to-transparent" />
    </section>
  );
};

export default HeroSection;