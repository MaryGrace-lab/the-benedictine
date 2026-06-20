import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';

export default function ContactActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
      <a
        href="https://wa.me/2347059443788"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:border-[#d4af37]/50 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group font-sans text-sm md:text-base"
      >
        <MessageCircle className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" aria-hidden="true" />
        WhatsApp
      </a>
      <a
        href="mailto:thebenedictineacademy@gmail.com"
        aria-label="Send an email to the school"
        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:border-[#d4af37]/50 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group font-sans text-sm md:text-base"
      >
        <Mail className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" aria-hidden="true" />
        Email Us
      </a>
    </div>
  );
}