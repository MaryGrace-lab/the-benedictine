'use client';

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Add this effect to set scroll padding
  useEffect(() => {
    // Add scroll padding to account for fixed header
    document.documentElement.style.scrollPaddingTop = '80px'; // 80px for desktop (h-20)
    
    // Adjust for mobile
    const updateScrollPadding = () => {
      if (window.innerWidth < 768) {
        document.documentElement.style.scrollPaddingTop = '64px'; // 64px for mobile (h-16)
      } else {
        document.documentElement.style.scrollPaddingTop = '80px';
      }
    };
    
    updateScrollPadding();
    window.addEventListener('resize', updateScrollPadding);
    
    return () => {
      document.documentElement.style.scrollPaddingTop = '';
      window.removeEventListener('resize', updateScrollPadding);
    };
  }, []);

  // Handle Escape key and Resize
  useEffect(() => {
    const handleEvents = (e: any) => {
      if (e.key === "Escape" || (e.type === 'resize' && window.innerWidth >= 1024)) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEvents);
    window.addEventListener("resize", handleEvents);
    return () => {
      window.removeEventListener("keydown", handleEvents);
      window.removeEventListener("resize", handleEvents);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
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
        menuRef={menuRef}
      />

      <main className="flex-1 pt-16 md:pt-20">{children}</main>

      <Footer />
    </div>
  );
}