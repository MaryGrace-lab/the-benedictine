"use client";

import React, { useRef } from 'react';
import HeroSection from './_components/HeroSection';
import CurriculumSection from './_components/CurriculumSection';
import CTASection from './_components/CTASection';
import { curriculumSections } from './_data/curriculum';

const AcademicsPage = () => {
  const programsRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <HeroSection scrollToRef={programsRef} />

      <div ref={programsRef}>
        {curriculumSections.map((section, index) => (
          <CurriculumSection 
            key={section.id} 
            section={section} 
            index={index} 
          />
        ))}
      </div>

      <CTASection />
    </main>
  );
};

export default AcademicsPage;