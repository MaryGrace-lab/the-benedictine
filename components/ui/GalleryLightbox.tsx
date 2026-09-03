// components/ui/GalleryLightbox.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Optional plugins (uncomment if installed)
// import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
// import Zoom from 'yet-another-react-lightbox/plugins/zoom';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
}

export default function GalleryLightbox({
  images,
  columns = 3,
  aspectRatio = 'square',
}: GalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Map images to lightbox format
  const lightboxImages = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    title: img.title,
    description: img.description,
  }));

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  }[aspectRatio];

  const columnsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns];

  if (images.length === 0) return null;

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={`grid ${columnsClass} gap-3 md:gap-4`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setOpen(true);
            }}
            className={`relative ${aspectRatioClass} w-full overflow-hidden rounded-xl bg-stone-100 group transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#eab308] focus:ring-offset-2`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-bold bg-black/50 px-3 py-1.5 rounded-full transition-all duration-300">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox - only render when mounted to avoid hydration issues */}
      {mounted && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={lightboxImages}
          index={currentIndex}
          carousel={{
            finite: false,
            preload: 2,
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
          render={{
            slide: ({ slide }) => (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={slide.src}
                  alt={slide.alt || 'Gallery image'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={false}
                />
                {slide.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <h3 className="text-lg font-bold">{slide.title}</h3>
                    {slide.description && (
                      <p className="text-sm text-white/80">{slide.description}</p>
                    )}
                  </div>
                )}
              </div>
            ),
          }}
        />
      )}
    </>
  );
}