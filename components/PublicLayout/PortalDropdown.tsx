//components/PublicLayout/PortalDropdown.tsx
"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { portalOptions } from "@/data/navigation";

interface PortalDropdownProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const PortalDropdown = ({ isOpen, onMouseEnter, onMouseLeave }: PortalDropdownProps) => {
  return (
    <div 
      className="relative group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button 
        className={`flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
          isOpen ? 'text-orange-600 bg-stone-50' : 'text-stone-600 hover:text-orange-600'
        }`}
      >
        Login Portal
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-48 py-2 mt-1 bg-white border border-stone-100 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {portalOptions.map((option) => (
            <Link
              key={option.name}
              href={option.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <option.icon className={`w-4 h-4 ${option.color}`} />
              {option.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalDropdown;