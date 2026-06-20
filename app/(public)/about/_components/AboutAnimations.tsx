"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Target,
  Binoculars,
  Heart,
  Shield,
  Star,
  Handshake,
  HeartHandshake,
} from 'lucide-react';
import { CoreValue } from '../_data/coreValues';
import Image from 'next/image';

// ──────────────── Animation Variants ────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

// ──────────────── Icon Mappings ────────────────
const MISSION_CARD_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
> = {
  target: Target,
  binoculars: Binoculars,
};

const CORE_VALUE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  heart: Heart,
  shield: Shield,
  star: Star,
  handshake: Handshake,
  heartHandshake: HeartHandshake,
};

// ──────────────── Hero Animations ────────────────
export function AnimatedHero() {
  return (
    <div className="max-w-4xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInLeft}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        Est. 2017
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-8 tracking-tight"
      >
        Excellence in <span className="text-primary">Education</span> & Character
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
      >
        A legacy of academic brilliance, guided by faith, discipline, and innovation since 2017.
      </motion.p>
    </div>
  );
}

// ──────────────── History Animations ────────────────
export function HistoryContent() {
  const years = new Date().getFullYear() - 2017;

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Text */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative"
      >
        <h2 className="text-4xl font-heading font-bold text-foreground mb-8">
          Our Journey
        </h2>
        <div
          className="space-y-6 text-muted-foreground text-lg leading-relaxed text-justify"
          lang="en"
        >
          <p>
            Founded in <span className="text-foreground font-semibold">2017</span> by
            Rev. Fr. Alphonsus Eromosele Ahiaegbe, our academy began as a small school with
            just 30 students and a vision to provide quality education rooted in moral values.
            Over the years, The Benedictine Academy has grown into one of the most prestigious
            educational institutions in the region, serving over{' '}
            <span className="text-foreground font-semibold">200 students</span> across
            primary and secondary levels. Our mission is to nurture the spiritual, intellectual,
            and personal growth of each student, preparing them to be compassionate leaders
            and responsible citizens. Located in the heart of the city, our school features
            state-of-the-art facilities, including modern classrooms, science and computer
            labs, a library, and sports facilities.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-background border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary">{years}+</p>
              <p className="text-sm">Years of Legacy</p>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm">Graduation Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scaleIn}
        className="relative group"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-[2rem] rotate-3 scale-105 blur-sm" />
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-background">
        <Image
          src="/1.jpg"
          alt="The Benedictine Academy campus building and students"
          width={600}
          height={400}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        </div>
      </motion.div>
    </div>
  );
}

// ──────────────── Mission & Vision Card ────────────────
interface MissionCardProps {
  iconKey: string;
  title: string;
  text: string;
}

export function MissionCard({ iconKey, title, text }: MissionCardProps) {
  const Icon = MISSION_CARD_ICONS[iconKey] ?? Target;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="group bg-card p-10 rounded-[2.5rem] shadow-xl border border-primary/10 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8">
        <Icon size={32} aria-hidden={true} />
      </div>
      <h3 className="text-3xl font-heading font-bold mb-4">{title}</h3>
      <p
        className="text-muted-foreground text-lg leading-relaxed text-justify"
        lang="en"
      >
        {text}
      </p>
    </motion.div>
  );
}

// ──────────────── Core Value Card ────────────────
interface CoreValueCardProps {
  value: CoreValue;
  index: number;
}

export function CoreValueCard({ value, index }: CoreValueCardProps) {
  const IconComponent = CORE_VALUE_ICONS[value.iconKey] ?? Star;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group p-8 rounded-3xl bg-background border border-border shadow-sm hover:border-primary/50 transition-all duration-500"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <IconComponent className="w-6 h-6" />
      </div>
      <span className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
        {value.name}
      </span>
    </motion.div>
  );
}