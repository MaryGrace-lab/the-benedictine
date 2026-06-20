import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SubjectListProps {
  subjects: string[];
}

export default function SubjectList({ subjects }: SubjectListProps) {
  if (!subjects || subjects.length === 0) {
    return (
      <p className="text-sm text-stone-400 italic mb-12">
        No subjects listed for this section.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-12">
      {subjects.map((subject) => (
        <div
          key={subject}
          className="flex items-center gap-3 text-stone-700 group"
        >
          <CheckCircle2
            className="w-5 h-5 text-amber-600/40 group-hover:text-amber-600 transition-colors flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-sm font-medium border-b border-transparent group-hover:border-amber-200 transition-all leading-tight">
            {subject}
          </span>
        </div>
      ))}
    </div>
  );
}