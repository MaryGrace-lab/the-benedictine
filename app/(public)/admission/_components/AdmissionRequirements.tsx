import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

const requirements = [
  'Completed application form (available at the school)',
  'Birth certificate (original and photocopy)',
  '2 recent passport photographs',
  'Previous school academic report/results',
  'Medical report from a recognized hospital',
  'Letter of recommendation from previous school (if applicable)',
  'Parent/Guardian identification (valid ID card)',
];

export default function AdmissionRequirements() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <FileText className="w-8 h-8 text-amber-600" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#270f01]">
            Admission Requirements
          </h2>
        </div>

        <ul className="space-y-4">
          {requirements.map((req, i) => (
            <li
              key={i}
              className="flex items-start gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-stone-700 text-lg">{req}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}