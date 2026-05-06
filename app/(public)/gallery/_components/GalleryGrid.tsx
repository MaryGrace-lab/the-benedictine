"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryCard from './GalleryCard';
import { GalleryImage } from '../_data/galleryImages';

interface GalleryGridProps {
  images: GalleryImage[];
  onSelect: (src: string) => void;
}

const GalleryGrid = ({ images, onSelect }: GalleryGridProps) => {
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
};

export default GalleryGrid;