'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/PublicLayout/Header';
import MobileMenu from '@/components/PublicLayout/MobileMenu';
import Footer from '@/components/PublicLayout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- Scroll padding for fixed header ---
  useEffect(() => {
    const setScrollPadding = () => {
      const headerHeight = document.querySelector('header')?.offsetHeight ?? 80;
      document.documentElement.style.scrollPaddingTop = `${headerHeight}px`;
    };
    setScrollPadding();
    window.addEventListener('resize', setScrollPadding);
    return () => window.removeEventListener('resize', setScrollPadding);
  }, []);

  // --- Close menu on Escape or large screen ---
  useEffect(() => {
    const handleEvents = (e: KeyboardEvent | Event) => {
      if (
        (e instanceof KeyboardEvent && e.key === 'Escape') ||
        (e instanceof Event && e.type === 'resize' && window.innerWidth >= 1024)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEvents as EventListener);
    window.addEventListener('resize', handleEvents);
    return () => {
      window.removeEventListener('keydown', handleEvents as EventListener);
      window.removeEventListener('resize', handleEvents);
    };
  }, []);

  // --- Prevent background scroll when mobile menu is open ---
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-100 selection:text-orange-900 bg-white font-sans">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}