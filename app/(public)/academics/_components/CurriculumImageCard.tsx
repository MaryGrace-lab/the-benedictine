"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface CurriculumImageCardProps {
  image: string;
  title: string;
  index: number;
}

const CurriculumImageCard = ({ image, title, index }: CurriculumImageCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex-1 w-full relative"
    >
      <div className="relative z-10 group">
        <div className="absolute -inset-4 border border-stone-200 rounded-2xl -z-10 transition-transform duration-700 group-hover:scale-105" />
        <div className="relative aspect-4/5 md:aspect-square overflow-hidden rounded-xl shadow-2xl">
          <img 
            src={image} 
            alt={title}
            className="object-cover w-full h-full grayscale-20% group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
        </div>

        <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl rounded-lg hidden md:block">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full text-amber-700">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase font-bold tracking-widest">Accredited</p>
              <p className="text-sm font-serif font-bold text-stone-800">Global Standards</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurriculumImageCard;