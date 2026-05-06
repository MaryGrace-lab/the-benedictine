"use client";

import React, { useState } from 'react';
import HeroSection from './_components/HeroSection';
import FilterBar from './_components/FilterBar';
import GalleryGrid from './_components/GalleryGrid';
import Lightbox from './_components/Lightbox';
import { galleryImages } from './_data/galleryImages';

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = filter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <FilterBar filter={filter} setFilter={setFilter} />
          <GalleryGrid images={filteredImages} onSelect={setSelectedImage} />
        </div>
      </section>

      <Lightbox selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  );
};

export default GalleryPage;