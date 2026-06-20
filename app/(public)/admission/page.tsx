import React from 'react';
import { Metadata } from 'next';
import AdmissionPageClient from './AdmissionPageClient';

export const metadata: Metadata = {
  title: 'Admission Requirements | The Benedictine Academy',
  description:
    'Learn about the admission requirements, guidelines, and application process for The Benedictine Academy.',
};

export default function AdmissionPage() {
  return <AdmissionPageClient />;
}