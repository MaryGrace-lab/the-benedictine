"use client";

import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;