"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const contactInfo = [
  { 
    icon: <MapPin className="w-5 h-5" />, 
    label: 'Address', 
    value: '37, Old Mechanic Road, Off Siluko Road Egor, Benin City, Edo State, Nigeria.' 
  },
  { 
    icon: <Phone className="w-5 h-5" />, 
    label: 'Phone', 
    value: '+234 705 944 3788' 
  },
  { 
    icon: <Mail className="w-5 h-5" />, 
    label: 'Email', 
    value: 'thebenedictineacademy@gmail.com' 
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      honeypot: formData.get('honeypot'), 
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Thanks for reaching out! We have received your message.', {
          duration: 5000,
        });
        (e.target as HTMLFormElement).reset(); 
      } else {
        let friendlyMessage = "Something went wrong. Please try again.";
        if (typeof result.error === 'object') {
          friendlyMessage = "Please ensure your phone number and message are fully filled out.";
        } else if (response.status === 429) {
          friendlyMessage = "You've sent a few messages recently. Please wait a bit before sending another.";
        }
        toast.error(friendlyMessage);
      }
    } catch (error: any) {
      toast.error("We're having trouble connecting. Please check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-[#270f01] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white mb-4 md:mb-6 leading-tight">
              Contact <span className="text-[#d4af37]">Us</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-sans leading-relaxed">
              We'd love to hear from you. Whether you have a question about admissions, 
              academics, or just want to say hello, our team is ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            
            {/* Info Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-8 md:space-y-12"
            >
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

              {/* MAP EMBED */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-xl h-64 md:h-80 group">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.345862828!2d5.5898864!3d6.3492751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1040ed6e94f06835%3A0x6767676767676767!2s37%20Old%20Mechanic%20Rd%2C%20Benin%20City!5e0!3m2!1sen!2sng!4v1714412345678!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>

            {/* Form Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 bg-white p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-2">Send a Message</h2>
              <p className="text-slate-500 mb-6 md:mb-8 text-sm font-sans">Fields marked with <span className="text-red-500 font-bold">*</span> are compulsory.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                
                {/* HONEYPOT (Anti-Spam) */}
                <input 
                  type="text" 
                  name="honeypot" 
                  aria-hidden="true"
                  style={{ display: 'none' }} 
                  tabIndex={-1} 
                  autoComplete="off" 
                />

                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="user-name" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#270f01]">
                      Full Name *
                    </label>
                    <input 
                      id="user-name"
                      required
                      name="name"
                      type="text"
                      placeholder="Your Name" 
                      className="w-full px-4 h-12 md:h-14 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-all font-sans text-sm md:text-base" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="user-email" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#270f01]">
                      Email Address *
                    </label>
                    <input 
                      id="user-email"
                      required
                      name="email"
                      type="email"
                      placeholder="name@email.com" 
                      className="w-full px-4 h-12 md:h-14 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-all font-sans text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="user-phone" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#270f01]">
                    Phone Number *
                  </label>
                  <input 
                    id="user-phone"
                    required
                    name="phone"
                    type="tel"
                    placeholder="+234..." 
                    className="w-full px-4 h-12 md:h-14 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-all font-sans text-sm md:text-base"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="user-message" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#270f01]">
                    Message *
                  </label>
                  <textarea 
                    id="user-message"
                    required
                    name="message"
                    placeholder="How can we help?" 
                    rows={4} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-all resize-none font-sans text-sm md:text-base" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group flex items-center justify-center gap-3 w-full px-8 py-4 md:py-5 bg-[#270f01] hover:bg-[#3d1902] text-white rounded-xl transition-all shadow-lg active:scale-[0.98] text-sm md:text-base font-bold disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${isSubmitting ? 'translate-x-10 opacity-0' : 'group-hover:translate-x-1'}`} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}