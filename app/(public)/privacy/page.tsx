import React from 'react';
import { Metadata } from 'next';
import PrivacyPageClient from './PrivacyPageClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Benedictine Academy',
  description:
    'Learn how we collect, use, and protect your personal information at The Benedictine Academy.',
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}