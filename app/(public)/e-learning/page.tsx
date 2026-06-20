import React from 'react';
import { Metadata } from 'next';
import ELearningPageClient from './ELearningPageClient';

export const metadata: Metadata = {
  title: 'E-Learning | The Benedictine Academy',
  description:
    'Our online learning platform is coming soon. Stay tuned for a transformative digital classroom experience.',
};

export default function ELearningPage() {
  return <ELearningPageClient />;
}