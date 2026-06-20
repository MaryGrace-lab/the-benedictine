import React from 'react';
import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us | The Benedictine Academy',
  description:
    'Get in touch with The Benedictine Academy. Send us a message, call, or visit our campus.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}