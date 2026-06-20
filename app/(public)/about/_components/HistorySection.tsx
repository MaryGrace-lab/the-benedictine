import React from 'react';
import { HistoryContent } from './AboutAnimations';

const HistorySection = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-6 lg:px-12">
        <HistoryContent />
      </div>
    </section>
  );
};

export default HistorySection;