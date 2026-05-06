"use client";

import React from 'react';
import { contactInfo } from '../_data/contactInfo';

const ContactInfoCard = () => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-6 md:mb-10">Get in Touch</h2>
      <div className="space-y-6 md:space-y-10">
        {contactInfo.map((item) => (
          <div key={item.label} className="flex items-start gap-4 md:gap-6 group">
            <div className="shrink-0 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white text-[#270f01] shadow-sm border border-slate-100 group-hover:bg-[#270f01] group-hover:text-white transition-all duration-300">
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#270f01] mb-1">{item.label}</p>
              <p className="text-slate-800 font-heading font-medium text-base md:text-lg leading-relaxed">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfoCard;