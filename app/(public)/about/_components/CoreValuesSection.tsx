import React from 'react';
import { coreValues } from '../_data/coreValues';
import { CoreValueCard } from './AboutAnimations';

const CoreValuesSection = () => {
  return (
    <section className="py-24 bg-primary/3">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-4xl font-heading font-bold text-foreground mb-16">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {coreValues.map((value, i) => (
            <CoreValueCard key={value.name} value={value} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;