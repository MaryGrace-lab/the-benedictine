"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CurriculumSection as CurriculumSectionType } from '../_types/academics';
import SubjectList from './SubjectList';
import CurriculumImageCard from './CurriculumImageCard';

interface CurriculumSectionProps {
  section: CurriculumSectionType;
  index: number;
}

const CurriculumSection = ({ section, index }: CurriculumSectionProps) => {
  const isReversed = index % 2 !== 0;

  return (
    <section 
      className={`py-32 relative overflow-hidden ${isReversed ? 'bg-stone-50' : 'bg-white'}`}
    >
      <div className="container mx-auto px-6">
        <div className={`flex flex-col lg:flex-row gap-20 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Image Side */}
          <CurriculumImageCard 
            image={section.image} 
            title={section.title} 
            index={index} 
          />

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-stone-100 border border-stone-200 mb-8">
              <span className="text-amber-700"><section.Icon className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
                {section.subtitle}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-6">
              {section.title}
            </h2>
            
            <p className="text-lg text-stone-600 mb-10 leading-relaxed font-light">
              {section.description}
            </p>

            <SubjectList subjects={section.subjects} />

            <button className="group flex items-center gap-3 px-8 py-4 bg-[#4A3728] text-stone-50 rounded-lg font-medium hover:bg-[#2C1810] transition-all shadow-lg active:scale-95">
              Request Prospectus 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;