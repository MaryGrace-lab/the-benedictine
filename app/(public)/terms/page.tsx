import React from 'react';
import { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
  title: 'Terms of Service | The Benedictine Academy',
  description:
    'Read the terms and conditions for using The Benedictine Academy website and services.',
};

export default function TermsPage() {
  return <TermsPageClient />;
}