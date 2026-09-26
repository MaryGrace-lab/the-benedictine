import HeroSection from './_components/HeroSection';
import HistorySection from './_components/HistorySection';
import MissionVisionSection from './_components/MissionVisionSection';
import CoreValuesSection from './_components/CoreValuesSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | The Benedictine Academy',
  description:
    'Learn about The Benedictine Academy, a Catholic education centre in Benin City, Edo State. Discover our history, mission, vision, and core values that guide our commitment to excellence in education.',
};


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