"use client";

import React from 'react';

interface HeroHeaderProps {
  showTracker: boolean;
  setShowTracker: (value: boolean) => void;
}

const HeroHeader = ({ showTracker, setShowTracker }: HeroHeaderProps) => {
  return (
    <header className="bg-[#270f01] py-12 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Admissions Portal</h1>
        <p className="text-brown-100 text-lg mb-8">Join our academic community for the 2026/2027 session.</p>
        
        <div className="flex bg-[#270f01] p-1 rounded-lg w-fit">
          <button 
            onClick={() => setShowTracker(false)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${!showTracker ? 'bg-white text-[#270f01] shadow-sm' : 'text-white hover:bg-orange-600'}`}
          >
            New Application
          </button>
          <button 
            onClick={() => setShowTracker(true)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${showTracker ? 'bg-white text-orange-600 shadow-sm' : 'text-white hover:bg-orange-600'}`}
          >
            Track Status
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeroHeader;