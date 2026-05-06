"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInUp } from '../../../_shared/_animations/variants';

const HeroSection = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-[0.03] -z-10" />
      
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Est. 2017
          </motion.div>
          
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-8 tracking-tight"
          >
            Excellence in <span className="text-primary">Education</span> & Character
          </motion.h1>
          
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            A legacy of academic brilliance, guided by faith, discipline, and innovation since 2017.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;