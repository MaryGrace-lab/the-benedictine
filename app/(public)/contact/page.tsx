"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HeroSection from './_components/HeroSection';
import ContactForm from './_components/ContactForm';
import ContactInfoCard from './_components/ContactInfoCard';
import ContactActions from './_components/ContactActions';
import MapEmbed from './_components/MapEmbed';

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <HeroSection />

      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            
            {/* Form - First on mobile, Left on desktop */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-1"
            >
              <ContactForm />
            </motion.div>

            {/* Info + Map - Second on mobile, Right on desktop */}
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
};

export default ContactPage;