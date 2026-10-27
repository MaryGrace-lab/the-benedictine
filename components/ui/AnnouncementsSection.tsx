// components/ui/AnnouncementsSection.tsx
"use client";

import { motion } from 'framer-motion';
import TiltCard from './TiltCard';
import type { HomeAnnouncement } from '@/app/(public)/_data/homepage';

interface AnnouncementsSectionProps {
  announcements: HomeAnnouncement[];
}

export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  if (announcements.length === 0) return null;

  return (
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
            <TiltCard key={a.id} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
                }}
                className="bg-card rounded-xl p-5 shadow-card border border-border hover:border-[#eab308]/50 transition-all h-full"
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
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}