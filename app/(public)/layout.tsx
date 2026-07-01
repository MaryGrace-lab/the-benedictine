'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/PublicLayout/Header';
import MobileMenu from '@/components/PublicLayout/MobileMenu';
import Footer from '@/components/PublicLayout/Footer';
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ChatAssistant from '@/components/ui/ChatAssistant';

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleResize = () => {
      if (mediaQuery.matches) setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    mediaQuery.addEventListener('change', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleResize);
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
    <div className="flex flex-col min-h-screen selection:bg-orange-100 selection:text-orange-900 bg-white">
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
      <WhatsAppButton />
      <ChatAssistant />
    </div>
  );
}