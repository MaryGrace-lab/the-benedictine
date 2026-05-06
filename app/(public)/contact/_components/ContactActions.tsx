import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';

const ContactActions = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
      <a 
        href="https://wa.me/2347059443788" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:border-[#d4af37]/50 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group font-sans text-sm md:text-base"
      >
        <MessageCircle className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" /> WhatsApp
      </a>
      <a 
        href="mailto:thebenedictineacademy@gmail.com" 
        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:border-[#d4af37]/50 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group font-sans text-sm md:text-base"
      >
        <Mail className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" /> Email Us
      </a>
    </div>
  );
};

export default ContactActions;