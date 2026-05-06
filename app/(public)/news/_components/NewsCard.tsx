"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { NewsItem } from '../_data/newsItems';

interface NewsCardProps {
  item: NewsItem;
  index: number;
}

const NewsCard = ({ item, index }: NewsCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="h-64 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#270f01] text-xs font-bold uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
        />
      </div>

      {/* Content Container */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <Calendar className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs font-medium uppercase tracking-wide">{item.date}</span>
        </div>
        
        <h3 className="text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-[#270f01] transition-colors">
          {item.title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-2">
          {item.excerpt}
        </p>

        <div className="flex items-center text-[#270f01] font-bold text-sm gap-2 cursor-pointer">
          Read Story 
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;