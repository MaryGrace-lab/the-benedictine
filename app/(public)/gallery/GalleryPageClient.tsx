"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { galleryImages, categories, GalleryImage } from './_data/galleryImages';
import HeroSection from './_components/HeroSection';

// ────────────── Filter Bar ──────────────
function FilterBar({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (cat: string) => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-start gap-3 mb-12"
      role="tablist"
      aria-label="Gallery filters"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={filter === cat}
          onClick={() => setFilter(cat)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
            filter === cat
              ? 'bg-[#eab308] text-black shadow-lg shadow-yellow-500/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ────────────── Gallery Card ──────────────
function GalleryCard({
  image,
  onSelect,
}: {
  image: GalleryImage;
  onSelect: (src: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative cursor-pointer"
      onClick={() => onSelect(image.src)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(image.src);
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${image.title}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-md">
        <Image
          src={image.src}
          alt={image.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#eab308] text-xs font-bold uppercase tracking-widest mb-1">
                {image.category}
              </p>
              <h3 className="text-white font-bold text-lg">{image.title}</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
              <Maximize2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────── Gallery Grid ──────────────
function GalleryGrid({
  images,
  onSelect,
}: {
  images: GalleryImage[];
  onSelect: (src: string) => void;
}) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {images.map((img) => (
          <GalleryCard key={img.id} image={img} onSelect={onSelect} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

// ────────────── Lightbox ──────────────
function Lightbox({
  selectedImage,
  onClose,
}: {
  selectedImage: string | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          tabIndex={0}
        >
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Full screen preview"
              fill
              className="object-contain rounded-lg"
              quality={90}
            />
          </motion.div>

          <p className="absolute bottom-4 text-white/50 text-xs sr-only">
            Press Escape to close
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ────────────── Main Page Component ──────────────
export default function GalleryPageClient() {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages =
    filter === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero – wrap server component in motion for entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
      </motion.div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <FilterBar filter={filter} setFilter={setFilter} />
          <GalleryGrid images={filteredImages} onSelect={setSelectedImage} />
        </div>
      </section>

      <Lightbox
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </main>
  );
}