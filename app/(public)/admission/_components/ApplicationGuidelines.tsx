import React from 'react';

const guidelines = [
  'Applications are accepted throughout the academic year for all classes.',
  'Prospective students must sit for an entrance examination.',
  'An interview with both parent and child is required.',
  'Admission decisions are communicated within 2 weeks of the interview.',
  'All documents must be submitted in person at the school premises.',
];

export default function ApplicationGuidelines() {
  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#270f01] mb-10">
          Application Guidelines
        </h2>

        <ol className="space-y-6">
          {guidelines.map((guide, i) => (
            <li
              key={i}
              className="flex items-start gap-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm"
            >
              <span className="w-10 h-10 rounded-full bg-[#270f01] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-stone-700 text-lg pt-1">{guide}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}