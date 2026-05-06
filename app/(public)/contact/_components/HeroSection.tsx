"use client";

import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 bg-[#270f01] overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white mb-4 md:mb-6 leading-tight">
            Contact <span className="text-[#d4af37]">Us</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-sans leading-relaxed">
            We'd love to hear from you. Whether you have a question about admissions, 
            academics, or just want to say hello, our team is ready to help.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;