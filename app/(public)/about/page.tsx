import React from 'react';
import HeroSection from './_components/HeroSection';
import HistorySection from './_components/HistorySection';
import MissionVisionSection from './_components/MissionVisionSection';
import CoreValuesSection from './_components/CoreValuesSection';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <HistorySection />
      <MissionVisionSection />
      <CoreValuesSection />
    </main>
  );
};

export default AboutPage;