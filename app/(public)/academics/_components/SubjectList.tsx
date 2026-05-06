"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SubjectListProps {
  subjects: string[];
}

const SubjectList = ({ subjects }: SubjectListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
      {subjects.map((subject) => (
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
  );
};

export default SubjectList;