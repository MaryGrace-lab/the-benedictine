"use client";

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LightboxProps {
  selectedImage: string | null;
  onClose: () => void;
}

const Lightbox = ({ selectedImage, onClose }: LightboxProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={onClose}
          onKeyDown={handleKeyDown}
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
};

export default Lightbox;