import React from 'react';
import { MissionCard } from './AboutAnimations';

const MissionVisionSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-8">
          <MissionCard
            iconKey="target"
            title="Our Mission"
            text="To provide a Christ-centered learning environment where every student is nurtured spiritually, academically, and personally. We are dedicated to forming young hearts and minds in the Catholic faith, preparing them to be compassionate leaders and service-oriented citizens who contribute to the Kingdom of God on Earth."
          />
          <MissionCard
            iconKey="binoculars"
            title="Our Vision"
            text="To be a beacon of Catholic education, recognized for academic excellence and the formation of virtuous individuals. We envision a community where faith is a living force, inspiring students to pursue knowledge, practice charity, and live a life rooted in Christ's teachings."
          />
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;