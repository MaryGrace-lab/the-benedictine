import React from 'react';
import { Metadata } from 'next';
import FAQPageClient from './FAQPageClient';

export const metadata: Metadata = {
  title: 'FAQ | The Benedictine Academy',
  description:
    'Find answers to common questions about admissions, fees, facilities, and life at The Benedictine Academy.',
};

export default function FAQPage() {
  return <FAQPageClient />;
}