"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import HeroSection from './_components/HeroSection';
import ContactInfoCard from './_components/ContactInfoCard';
import ContactActions from './_components/ContactActions';
import MapEmbed from './_components/MapEmbed';

/* ========================================================
   Animated Hero Text
   ======================================================== */
function AnimatedHero() {
  return (
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
  );
}

/* ========================================================
   Contact Form (interactive)
   ======================================================== */
function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrors({});

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
      // Check for field-specific validation errors
      if (result.details) {
        // Convert array errors to single strings
        const fieldErrors: Record<string, string> = {};
        for (const [key, value] of Object.entries(result.details)) {
          fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
        }
        setErrors(fieldErrors);
        toast.error('Please fix the errors below.');
      } else if (response.status === 429) {
        toast.error("You've sent a few messages recently. Please wait a bit before sending another.");
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    }
  } catch {
    toast.error("We're having trouble connecting. Please check your internet.");
  } finally {
    setIsSubmitting(false);
  }
};

  const labelClass = 'text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#270f01]';
  const inputClass =
    'w-full px-4 h-12 md:h-14 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-all font-sans text-sm md:text-base';
  const errorClass = 'text-red-500 text-xs mt-1';

  return (
    <div className="bg-white p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-2">
        Send a Message
      </h2>
      <p className="text-slate-500 mb-6 md:mb-8 text-sm font-sans">
        Fields marked with{' '}
        <span className="text-red-500 font-bold" aria-hidden="true">
          *
        </span>
        <span className="sr-only"> (asterisk)</span> are compulsory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
        {/* Honeypot */}
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
            <label htmlFor="user-name" className={labelClass}>
              Full Name <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <input
              id="user-name"
              required
              name="name"
              type="text"
              placeholder="Your Name"
              className={inputClass}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className={errorClass} role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="user-email" className={labelClass}>
              Email Address <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <input
              id="user-email"
              required
              name="email"
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className={errorClass} role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="user-phone" className={labelClass}>
            Phone Number <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">(Required)</span>
          </label>
          <input
            id="user-phone"
            required
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            className={inputClass}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className={errorClass} role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="user-message" className={labelClass}>
            Message <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">(Required)</span>
          </label>
          <textarea
            id="user-message"
            required
            name="message"
            placeholder="How can we help?"
            rows={4}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] transition-all resize-none font-sans text-sm md:text-base"
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className={errorClass} role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex items-center justify-center gap-3 w-full px-8 py-4 md:py-5 bg-[#270f01] hover:bg-[#3d1902] text-white rounded-xl transition-all shadow-lg active:scale-[0.98] text-sm md:text-base font-bold disabled:opacity-70"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
          <ArrowRight
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${
              isSubmitting ? 'translate-x-10 opacity-0' : 'group-hover:translate-x-1'
            }`}
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}

/* ========================================================
   Main Page Layout (with motion columns)
   ======================================================== */
export default function ContactPageClient() {
  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <HeroSection>
        <AnimatedHero />
      </HeroSection>

      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            {/* Form column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-1"
            >
              <ContactForm />
            </motion.div>

            {/* Info column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-2 space-y-8 md:space-y-12"
            >
              <ContactInfoCard />
              <ContactActions />
              <MapEmbed />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}