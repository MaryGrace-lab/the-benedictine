"use client";

import React, { useRef } from 'react'; // Added useRef
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, CheckCircle2, ArrowRight, Star } from 'lucide-react';

const sections = [
  {
    id: 'primary',
    title: 'Primary Section',
    subtitle: 'Nursery – Primary 6',
    description: 'Our primary section provides a strong foundation in literacy, numeracy, and social skills through interactive and child-centered teaching methods in a nurturing environment.',
    subjects: [
      'English Language', 'Mathematics', 'CRS', 'Civic Education', 'Verbal & Quantitative Reasoning', 
      'Programming', 'Basic Science & Technology', 'Social Studies', 'Creative Arts', 'ICT', 
      'Martial Arts', 'Religious Studies', 'Music', 'Agricultural Science', 'Home Economics', 
      'Writing', 'Diction', 'Public Speaking', 'Numeracy', 'Physical Education', 'Moral Education', 'Engineering'
    ],
    image: '/primary.jpg', 
    icon: <BookOpen className="w-5 h-5" />,
    accent: "bg-amber-100 text-amber-900"
  },
  {
    id: 'secondary',
    title: 'Secondary Section',
    subtitle: 'JSS 1 – SS 3',
    description: 'Our secondary program offers a rigorous academic curriculum designed to prepare students for national examinations (WAEC, NECO) and global leadership opportunities.',
    subjects: [
      'English Studies', 'Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 
      'Financial Accounting', 'Geography', 'Literature In English', 'Marketing', 'Government', 
      'Economics', 'Commerce', 'Martial Arts', 'Music', 'Agricultural Science', 'Home Economics', 
      'Programming', 'Engineering', 'Technical Drawing', 'Project Defence'
    ],
    image: '/secondary.jpg',
    icon: <GraduationCap className="w-5 h-5" />,
    accent: "bg-orange-100 text-orange-900"
  },
];

export default function AcademicsPage() {
  // 1. Create a reference for the section you want to scroll to
  const programsRef = useRef<HTMLDivElement>(null);

  // 2. Smooth scroll function
  const scrollToPrograms = () => {
    programsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-stone-900">
      {/* Hero Section */}
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
               {/* 3. Attach the scrollToPrograms function to the button */}
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

      {/* Curriculum Sections - 4. Added the Ref here */}
      <div ref={programsRef}>
        {sections.map((section, index) => (
          <section 
            key={section.title} 
            className={`py-32 relative overflow-hidden ${index % 2 !== 0 ? 'bg-stone-50' : 'bg-white'}`}
          >
            <div className="container mx-auto px-6">
              <div className={`flex flex-col lg:flex-row gap-20 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Image Side */}
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
                        src={section.image} 
                        alt={section.title}
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

                {/* Text Side */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex-1"
                >
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-stone-100 border border-stone-200 mb-8">
                    <span className="text-amber-700">{section.icon}</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                    {section.subjects.map((subject) => (
                      <div 
                        key={subject} 
                        className="flex items-center gap-3 text-stone-700 group cursor-default"
                      >
                        <CheckCircle2 className="w-5 h-5 text-amber-600/40 group-hover:text-amber-600 transition-colors" />
                        <span className="text-sm font-medium border-b border-transparent group-hover:border-amber-200 transition-all">
                          {subject}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className="group flex items-center gap-3 px-8 py-4 bg-[#4A3728] text-stone-50 rounded-lg font-medium hover:bg-[#2C1810] transition-all shadow-lg active:scale-95">
                    Request Prospectus 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <section className="bg-stone-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center border border-stone-200 p-12 rounded-3xl bg-white/50 backdrop-blur-sm">
          <h3 className="text-3xl font-serif mb-4">Ready to join our community?</h3>
          <p className="text-stone-600 mb-8">Admissions for the 2026/2027 academic session are now open.</p>
          <button className="px-10 py-4 border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728] hover:text-white transition-all rounded-full font-bold">
            Start Your Application
          </button>
        </div>
      </section>
    </main>
  );
}