"use client";

import React from 'react';
import { categories } from '../_data/galleryImages';

interface FilterBarProps {
  filter: string;
  setFilter: (category: string) => void;
}

const FilterBar = ({ filter, setFilter }: FilterBarProps) => {
  return (
    <div 
      className="flex flex-wrap items-center justify-start gap-3 mb-12" 
      role="tablist" 
      aria-label="Gallery filters"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={filter === cat}
          onClick={() => setFilter(cat)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
            filter === cat 
              ? 'bg-[#eab308] text-black shadow-lg shadow-yellow-500/20' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;