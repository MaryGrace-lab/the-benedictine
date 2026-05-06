"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { coreValues } from '../_data/coreValues';

const CoreValuesSection = () => {
  return (
    <section className="py-24 bg-primary/3">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-4xl font-heading font-bold text-foreground mb-16">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {coreValues.map((value, i) => {
            const IconComponent = value.Icon; // ✅ Extract icon component
            return (
              <motion.div
                key={value.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-background border border-border shadow-sm hover:border-primary/50 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <IconComponent className="w-6 h-6" /> {/* ✅ Render icon here */}
                </div>
                <span className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                  {value.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;