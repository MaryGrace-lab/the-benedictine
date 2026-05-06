"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { GalleryImage } from '../_data/galleryImages';

interface GalleryCardProps {
  image: GalleryImage;
  onSelect: (src: string) => void;
}

const GalleryCard = ({ image, onSelect }: GalleryCardProps) => {
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
};

export default GalleryCard;