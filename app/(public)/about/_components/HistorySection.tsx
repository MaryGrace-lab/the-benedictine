"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn } from '../../../_shared/_animations/variants';

const HistorySection = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp}
            className="relative"
          >
            <h2 className="text-4xl font-heading font-bold text-foreground mb-8">Our Journey</h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Founded in <span className="text-foreground font-semibold">2017</span> by Rev. Fr. Alphonsus Eromosele Ahiaegbe, 
                our academy began as a small school with just 30 students and a vision to provide quality education rooted in moral values. 
                Over the past nine years, The Benedictine Academy has grown into one of the most prestigious educational institutions in the region, 
                serving over 200 students across primary and secondary levels. Our mission is to nurture the spiritual, intellectual, and personal 
                growth of each student, preparing them to be compassionate leaders and responsible citizens. Located in the heart of the city, our 
                school features state-of-the-art facilities, including modern classrooms, science and computer labs, a library, and sports facilities.
              </p>
              <p>
                Today, we stand as a beacon of prestige, serving over <span className="text-foreground font-semibold">200 students</span>. 
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-2xl bg-background border border-border shadow-sm">
                  <p className="text-3xl font-bold text-primary">9+</p>
                  <p className="text-sm">Years of Legacy</p>
                </div>
                <div className="p-4 rounded-2xl bg-background border border-border shadow-sm">
                  <p className="text-3xl font-bold text-primary">100%</p>
                  <p className="text-sm">Graduation Rate</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="relative group"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] rotate-3 scale-105 blur-sm" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-background">
              <img 
                src="/1.jpg" 
                alt="Benedictine Academy" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;