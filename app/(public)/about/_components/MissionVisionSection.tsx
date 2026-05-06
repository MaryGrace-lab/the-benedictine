"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Binoculars } from 'lucide-react';
import { fadeUp } from '../../../_shared/_animations/variants';

const MissionVisionSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp} 
            className="group bg-card p-10 rounded-[2.5rem] shadow-xl border border-primary/10 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8">
              <Target size={32} />
            </div>
            <h3 className="text-3xl font-heading font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To provide a Christ-centered learning environment where every student is nurtured spiritually, academically, 
              and personally. We are dedicated to forming young hearts and minds in the Catholic faith, preparing them to be 
              compassionate leaders and service-oriented citizens who contribute to the Kingdom of God on Earth.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp} 
            className="group bg-card p-10 rounded-[2.5rem] shadow-xl border border-primary/10 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8">
              <Binoculars size={32} />
            </div>
            <h3 className="text-3xl font-heading font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To be a beacon of Catholic education, recognized for academic excellence and the formation of virtuous individuals. 
              We envision a community where faith is a living force, inspiring students to pursue knowledge, practice charity, 
              and live a life rooted in Christ's teachings.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;