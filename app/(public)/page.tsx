"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Star, 
  UserCheck 
} from 'lucide-react';

// 1. Data Definitions
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.5 } 
  }),
};

const stats = [
  { icon: <Users />, value: '150+', label: 'Students' },
  { icon: <GraduationCap />, value: '90%', label: 'Pass Rate' },
  { icon: <UserCheck />, value: '25+', label: 'Expert Teachers' },
  { icon: <BookOpen />, value: '50+', label: 'Subjects' }
];

const highlights = [
  { 
    title: 'Academic Excellence', 
    description: 'Maintaining a legacy of distinction with a consistent 90% pass rate in external examinations, empowering students to reach their full intellectual potential.', 
    icon: '🎓' 
  },
  { 
    title: 'Modern Facilities', 
    description: 'An innovative learning environment featuring advanced ICT and science labs, professional music and martial arts studios, and comprehensive athletic grounds.', 
    icon: '🏫' 
  },
  { 
    title: 'Character Formation', 
    description: 'Cultivating leaders through The Benedictine Academy’s core pillars of discipline, integrity, and a lifelong commitment to community service.', 
    icon: '⭐' 
  },
  { 
    title: 'Sports & Arts', 
    description: 'A dynamic extracurricular landscape where students thrive in competitive athletics, creative arts, and eloquent discourse through our debate programs.', 
    icon: '⚽' 
  },
];

const announcements = [
  { id: 1, category: 'academic', date: '2026-04-15', title: 'School Resumption', content: 'School will resume on 27th of April 2026.' },
];

const testimonials = [
  { name: 'John Doe', role: 'Parent', content: 'The best decision for my children.' },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero - Adjusted min-height and padding for mobile responsiveness */}
      <section className="relative min-h-screen md:min-h-[90vh] flex items-center overflow-hidden">
        {/* 1. The Image Layer */}
        <div 
          className="absolute inset-0 bg-[url('/1.jpg')] bg-cover bg-center" 
          style={{ zIndex: 0 }}
        />
        
        {/* 2. The Brown Tint Layer */}
        <div 
          className="absolute inset-0 bg-[#241a16]/70 backdrop-brightness-[0.7]" 
          style={{ zIndex: 1 }}
        />

        {/* 3. Content Layer - Added large bottom padding (pb-64) to prevent clashing with stats */}
        <div className="container mx-auto px-4 pt-32 pb-64 md:pt-20 md:pb-32 relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.span variants={fadeUp} custom={0} className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-white text-sm font-semibold mb-6 border border-white/20 backdrop-blur-md">
              📚 Admissions Open for 2026/2027 Session
            </motion.span>
            
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Nurturing Minds,<br />
              <span className="text-[#eab308]">Building Character</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              At Benedictine Academy, we provide a holistic education that develops the mind, body, and spirit. Join a community committed to excellence since 2017.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link href="/admission">
                <Button className="bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold" size="lg">
                  Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-black hover:bg-[#ffca58b6] hover:text-black transition-all"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar - Positioned at bottom with mobile grid fix */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="container mx-auto px-0 md:px-4">
            <div className="bg-[#1a1513] border-t border-white/10 rounded-t-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                {stats.map((s, i) => (
                  <motion.div 
                    key={s.label} 
                    variants={fadeUp} 
                    custom={i + 4} 
                    initial="hidden" 
                    animate="visible" 
                    className="flex items-center justify-center gap-4 py-6 md:py-8 px-4 md:px-6 hover:bg-white/5 transition-colors border-b border-white/5 md:border-b-0"
                  >
                    <div className="p-2 md:p-3 rounded-full bg-primary/10 text-[#eab308]">
                      {React.cloneElement(s.icon as React.ReactElement<any>, { className: "w-6 h-6 md:w-8 h-8" })}
                    </div>
                    <div className="text-left">
                      <div className="text-xl md:text-3xl font-bold text-white tracking-tight leading-none">
                        {s.value}
                      </div>
                      <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/50 font-semibold mt-1">
                        {s.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">Latest Announcements</h2>
            <p className="text-muted-foreground mb-8">Stay updated with the latest happenings at The Benedictine Academy</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {announcements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-primary/10 hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.category === 'academic' ? 'bg-primary/10 text-primary' :
                    a.category === 'event' ? 'bg-accent/20 text-accent-foreground' :
                    'bg-secondary/20 text-secondary'
                  }`}>
                    {a.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Why Choose The Benedictine Academy?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover what makes our academy a premier institution for holistic education</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-card shadow-card border border-border group hover:border-primary/20 transition-all"
              >
                <div className="text-4xl mb-4">{h.icon}</div>
                <h3 className="font-display font-semibold text-foreground mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Fixed colors by using a solid background color fallback */}
      <section className="py-16 bg-[#241a16]"> 
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-white text-center mb-12">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-[#eab308] text-[#eab308]" />)}
                </div>
                <p className="text-white/90 mb-4 italic">"{t.content}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-white/60">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-card border border-border p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Ready to Join Our Community?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">Take the first step towards a transformative educational experience. Applications for 2026/2027 are now open.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admission"><Button variant="default" size="lg" className="bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold">Start Application</Button></Link>
              <Link href="/contact"><Button variant="outline" size="lg">Contact Us</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}