import React from 'react';
import { Metadata } from 'next';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery | The Benedictine Academy',
  description:
    'View photos of our campus, events, and vibrant student life at The Benedictine Academy.',
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}