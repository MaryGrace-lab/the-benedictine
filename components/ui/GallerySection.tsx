// components/ui/GallerySection.tsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import type { GalleryImage } from '@/app/(public)/_data/homepage';
import { Button } from '@/components/ui/button';

const GalleryLightbox = dynamic(
  () => import('@/components/ui/GalleryLightbox'),
  {
    loading: () => (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square rounded-xl bg-stone-200 animate-pulse" />
        ))}
      </div>
    ),
    // ✅ REMOVED ssr: false to fix blank page on navigation
  }
);

interface GallerySectionProps {
  images: GalleryImage[];
}

export default function GallerySection({ images }: GallerySectionProps) {
  if (images.length === 0) return null;

  // Show only first 3 images on the homepage
  const displayedImages = images.slice(0, 3);
  const hasMoreImages = images.length > 3;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center sm:text-left">
              Our School Gallery
            </h2>
            {hasMoreImages && (
              <Link href="/gallery" prefetch={true}>
                <Button
                  variant="outline"
                  className="mt-2 sm:mt-0 border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white transition-all group"
                >
                  See More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Take a glimpse into the vibrant life and learning at The Benedictine Academy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GalleryLightbox
            images={displayedImages}
            columns={3}
            aspectRatio="square"
          />
        </motion.div>
      </div>
    </section>
  );
}