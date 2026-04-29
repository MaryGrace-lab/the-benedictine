"use client";

import { useState } from 'react';
import Image from 'next/image'; // Import Next.js Image
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';

const galleryImages = [
  { id: 1, title: 'Main School Building', category: 'School', src: '/1.jpg' },
  { id: 2, title: 'Science Laboratory', category: 'Academic', src: '/science.png' },
  { id: 3, title: 'Annual Excursion', category: 'Events', src: '/excursion1.jpg' },
  { id: 4, title: 'Annual Excursion', category: 'Events', src: '/excursion2.jpg' },
  { id: 5, title: 'Annual Excursion', category: 'Events', src: '/excursion3.jpg' },
  { id: 6, title: 'Home Economics Practical', category: 'Events', src: '/econs-practical-1.jpg' },
  { id: 7, title: 'Home Economics Practical', category: 'Events', src: '/econs-practical-2.jpg' },
  { id: 8, title: 'Soap Production Practical', category: 'Academic', src: '/soap-practical.jpg' },
  { id: 9, title: 'Classroom', category: 'Facilities', src: '/classroom.jpg' },
  { id: 10, title: 'Computer Lab', category: 'Facilities', src: '/computer-lab.jpg' },
  { id: 11, title: 'Music Room', category: 'Facilities', src: '/music.jpg' },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = ['All', 'School', 'Academic', 'Facilities', 'Events'];

  const filteredImages = filter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#270f01] overflow-hidden">
        {/* Next.js Image as Background */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <Image 
            src="/1.jpg" 
            alt="Background Pattern" 
            fill 
            className="object-cover"
            priority // Loads this immediately
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-[#eab308]">Gallery</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Glimpses of life, achievements, and the vibrant community at The Benedictine Academy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-wrap items-center justify-start gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
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

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedImage(img.src)}
                >
                  {/* Aspect Ratio Container for Next.js Image */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-md">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill // Fills the aspect ratio container
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#eab308] text-xs font-bold uppercase tracking-widest mb-1">{img.category}</p>
                          <h3 className="text-white font-bold text-lg">{img.title}</h3>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Using fill here to ensure the lightbox image stays within its bounds */}
              <Image
                src={selectedImage}
                alt="Full screen preview"
                fill
                className="object-contain rounded-lg"
                quality={90}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}