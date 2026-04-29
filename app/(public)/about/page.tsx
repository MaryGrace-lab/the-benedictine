"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion'; // Added Variants here
import { Target, Binoculars, Shield, Star, BookOpen, Heart, Users } from 'lucide-react';

// Explicitly typing this constant as Variants fixes the index signature error
const fadeUp: Variants = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  } 
};

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-[0.03] -z-10" />
        
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Est. 2017
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-8 tracking-tight"
            >
              Excellence in <span className="text-primary">Education</span> & Character
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              A legacy of academic brilliance, guided by faith, discipline, and innovation since 2017.
            </motion.p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp}
              className="relative"
            >
              <h2 className="text-4xl font-heading font-bold text-foreground mb-8">Our Journey</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Founded in <span className="text-foreground font-semibold">2017</span> by Rev. Fr. Alphonsus Eromosele Ahiaegbe, 
                  our academy began as a small school with just 30 students and a vision to provide quality education rooted in moral values. 
                  Over the past nine years, The Benedictine Academy has grown into one of the most prestigious educational institutions in the region, 
                  serving over 200 students across primary and secondary levels. Our mission is to nurture the spiritual, intellectual, and personal 
                  growth of each student, preparing them to be compassionate leaders and responsible citizens. Located in the heart of the city, our 
                  school features state-of-the-art facilities, including modern classrooms, science and computer labs, a library, and sports facilities.
                </p>
                <p>
                  Today, we stand as a beacon of prestige, serving over <span className="text-foreground font-semibold">200 students</span>. 
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-4 rounded-2xl bg-background border border-border shadow-sm">
                    <p className="text-3xl font-bold text-primary">9+</p>
                    <p className="text-sm">Years of Legacy</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background border border-border shadow-sm">
                    <p className="text-3xl font-bold text-primary">100%</p>
                    <p className="text-sm">Graduation Rate</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-[2rem] rotate-3 scale-105 blur-sm" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-background">
                <img 
                  src="/1.jpg" 
                  alt="Benedictine Academy" 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
              className="group bg-card p-10 rounded-[2.5rem] shadow-xl border border-primary/10 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-heading font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To provide a Christ-centered learning environment where every student is nurtured spiritually, academically, 
                and personally. We are dedicated to forming young hearts and minds in the Catholic faith, preparing them to be 
                compassionate leaders and service-oriented citizens who contribute to the Kingdom of God on Earth.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
              className="group bg-card p-10 rounded-[2.5rem] shadow-xl border border-primary/10 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8">
                <Binoculars size={32} />
              </div>
              <h3 className="text-3xl font-heading font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To be a beacon of Catholic education, recognized for academic excellence and the formation of virtuous individuals. 
                We envision a community where faith is a living force, inspiring students to pursue knowledge, practice charity, 
                and live a life rooted in Christ's teachings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-primary/3">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Faith', icon: <Heart className="w-6 h-6" /> },
              { name: 'Discipline', icon: <Shield className="w-6 h-6" /> },
              { name: 'Excellence', icon: <Star className="w-6 h-6" /> },
              { name: 'Integrity', icon: <Users className="w-6 h-6" /> },
              { name: 'Service', icon: <BookOpen className="w-6 h-6" /> }
            ].map((value, i) => (
              <motion.div
                key={value.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-background border border-border shadow-sm hover:border-primary/50 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {value.icon}
                </div>
                <span className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                  {value.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;