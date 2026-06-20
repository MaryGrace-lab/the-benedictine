import React from 'react';
import HomePageClient from './HomePageClient';
import {
  homeStats,
  homeAnnouncements,
  homeHighlights,
  homeTestimonials,
} from './_data/homepage';

export default function HomePage() {
  return (
    <HomePageClient
      stats={homeStats}
      announcements={homeAnnouncements}
      highlights={homeHighlights}
      testimonials={homeTestimonials}
    />
  );
}