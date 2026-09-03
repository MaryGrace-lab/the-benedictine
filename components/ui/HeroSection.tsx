// components/ui/HeroSection.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { HomeStat } from '@/app/(public)/_data/homepage';
import CountUp from './CountUp';
import { fadeUp, ICON_MAP } from '@/lib/constants';

interface HeroSectionProps {
  stats: HomeStat[];
  shouldReduceMotion: boolean;
}

export default function HeroSection({ stats, shouldReduceMotion }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      <Image
        src="/1.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
        loading="eager"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#241a16]/70 backdrop-brightness-[0.7]" aria-hidden="true" />

      <div className="container mx-auto px-5 pt-8 pb-56 md:pt-8 md:pb-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex-1 text-left"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-white text-sm font-semibold mb-6 border border-white/20 backdrop-blur-md"
            >
              📚 Admissions Open for 2026/2027 Session
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
            >
              Nurturing Minds,
              <br />
              <span className="text-[#eab308]">Building Character</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
            >
              At The Benedictine Academy, we provide a holistic education that develops the mind, body,
              and spirit. Join a community committed to excellence since 2017.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
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

          {/* Right side: Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block flex-shrink-0"
          >
            <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <Image
                src="/logo.png"
                alt="The Benedictine Academy Logo"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1024px) 0px, 288px"
                priority={false}
              />
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#eab308]/20 to-transparent skew-x-12"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="container mx-auto px-2 md:px-4">
          <div className="bg-[#1a1513] border-t border-white/10 rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {stats.map((s, i) => {
                const IconComponent = ICON_MAP[s.key];
                const numericMatch = s.value.match(/(\d+)/);
                const numericEnd = numericMatch ? parseInt(numericMatch[0], 10) : 0;
                const suffix = s.value.replace(/\d+/, '');

                return (
                  <motion.div
                    key={s.label}
                    variants={fadeUp}
                    custom={i + 4}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-center gap-4 py-4 md:py-8 px-4 md:px-6 hover:bg-white/5 transition-colors border-b border-white/5 md:border-b-0"
                  >
                    <div
                      className="p-2 md:p-3 rounded-full bg-primary/10 text-[#eab308]"
                      aria-hidden="true"
                    >
                      {IconComponent && <IconComponent className="w-6 h-6 md:w-8 h-8" />}
                    </div>
                    <div className="text-left">
                      <div className="text-xl md:text-3xl font-bold text-white tracking-tight leading-none">
                        {shouldReduceMotion ? (
                          s.value
                        ) : (
                          <CountUp end={numericEnd} suffix={suffix} duration={2000} />
                        )}
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
  );
}