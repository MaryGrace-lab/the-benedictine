"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  ArrowRight,
  Star,
  Bell,
} from 'lucide-react';
import type {
  HomeStat,
  HomeAnnouncement,
  HomeHighlight,
  HomeTestimonial,
} from './_data/homepage';

// ---------- Animation variants (unchanged) ----------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

// ---------- Icon mapping ----------
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  graduationCap: GraduationCap,
  userCheck: UserCheck,
  bookOpen: BookOpen,
};

interface HomePageClientProps {
  stats: HomeStat[];
  announcements: HomeAnnouncement[];
  highlights: HomeHighlight[];
  testimonials: HomeTestimonial[];
}

export default function HomePageClient({
  stats,
  announcements,
  highlights,
  testimonials,
}: HomePageClientProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Skip to content – accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to content
      </a>

      <main className="flex-1 overflow-x-hidden" id="main-content">
        {/* ===== Announcement Bar ===== */}
        <div className="bg-[#eab308] py-2.5 px-4 border-b border-black/5">
          <div className="container mx-auto flex items-center justify-center gap-3 text-[#270f01]">
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="shrink-0"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
            </motion.div>
            <p className="text-xs md:text-sm font-bold font-sans text-center leading-tight">
              <span className="uppercase tracking-wider mr-2 bg-[#270f01] text-white px-1.5 py-0.5 rounded text-[9px] md:text-[10px]">
                Notice
              </span>
              Resumption Date: Third Term begins Monday, April 27th, 2026.
            </p>
            <Link
              href="/news"
              className="hidden sm:flex items-center gap-1 text-[10px] md:text-xs font-black uppercase tracking-wider hover:underline ml-2"
            >
              Details <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ===== Hero Section ===== */}
        <section className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
          <Image
            src="/1.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[#241a16]/70 backdrop-brightness-[0.7]"
            aria-hidden="true"
          />

          <div className="container mx-auto px-4 pt-8 pb-64 md:pt-8 md:pb-32 relative z-10">
            <motion.div initial="hidden" animate="visible" className="max-w-3xl">
              <motion.span
                variants={shouldReduceMotion ? {} : fadeUp}
                custom={0}
                className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-white text-sm font-semibold mb-6 border border-white/20 backdrop-blur-md"
              >
                📚 Admissions Open for 2026/2027 Session
              </motion.span>

              <motion.h1
                variants={shouldReduceMotion ? {} : fadeUp}
                custom={1}
                className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
              >
                Nurturing Minds,
                <br />
                <span className="text-[#eab308]">Building Character</span>
              </motion.h1>

              <motion.p
                variants={shouldReduceMotion ? {} : fadeUp}
                custom={2}
                className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
              >
                At The Benedictine Academy, we provide a holistic education that develops the mind, body,
                and spirit. Join a community committed to excellence since 2017.
              </motion.p>

              <motion.div variants={shouldReduceMotion ? {} : fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link href="/admission">
                  <Button className="bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold" size="lg">
                    Apply Now <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
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

          {/* Stats bar */}
          <div className="absolute bottom-0 left-0 w-full z-20">
            <div className="container mx-auto px-0 md:px-4">
              <div className="bg-[#1a1513] border-t border-white/10 rounded-t-2xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                  {stats.map((s, i) => {
                    const IconComponent = ICON_MAP[s.key];
                    return (
                      <motion.div
                        key={s.label}
                        variants={shouldReduceMotion ? {} : fadeUp}
                        custom={i + 4}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center justify-center gap-4 py-6 md:py-8 px-4 md:px-6 hover:bg-white/5 transition-colors border-b border-white/5 md:border-b-0"
                      >
                        <div
                          className="p-2 md:p-3 rounded-full bg-primary/10 text-[#eab308]"
                          aria-hidden="true"
                        >
                          {IconComponent && <IconComponent className="w-6 h-6 md:w-8 h-8" />}
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Announcements ===== */}
        {announcements.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                  Latest Announcements
                </h2>
                <p className="text-muted-foreground mb-8">
                  Stay updated with the latest happenings at The Benedictine Academy
                </p>
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
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          a.category === 'academic'
                            ? 'bg-primary/10 text-primary'
                            : a.category === 'event'
                            ? 'bg-accent/20 text-accent-foreground'
                            : 'bg-secondary/20 text-secondary'
                        }`}
                      >
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
        )}

        {/* ===== Why Choose Us ===== */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Why Choose The Benedictine Academy?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover what makes our academy a premier institution for holistic education
              </p>
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
                  <div className="text-4xl mb-4" aria-hidden="true">
                    {h.icon}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{h.title}</h3>
                  <p className="text-sm text-muted-foreground">{h.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Testimonials ===== */}
        {testimonials.length > 0 && (
          <section className="py-16 bg-[#270f01]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-display font-bold text-white text-center mb-12">
                What People Say
              </h2>
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
                    <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          className="w-4 h-4 fill-[#eab308] text-[#eab308]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-white/90 mb-4 italic">“{t.content}”</p>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-white/60">{t.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== CTA ===== */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-2xl shadow-card border border-border p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Take the first step towards a transformative educational experience. Applications for
                2026/2027 are now open.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/admission">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold"
                  >
                    Start Application
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}