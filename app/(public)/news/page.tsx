import React from 'react';
import { Metadata } from 'next';
import NewsPageClient from './NewsPageClient';

export const metadata: Metadata = {
  title: 'News & Events | The Benedictine Academy',
  description:
    'Stay updated with the latest stories, achievements, and upcoming activities from The Benedictine Academy community.',
};

export default function NewsPage() {
  return <NewsPageClient />;
}