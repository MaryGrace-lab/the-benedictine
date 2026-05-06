'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, User, Users, Home, Info, BookOpen, UserPlus, Phone, HelpCircle, Newspaper, ImageIcon, X, Menu } from "lucide-react";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/academics", label: "Academics", icon: BookOpen },
  { href: "/admission", label: "Admission", icon: UserPlus },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/FAQ", label: "FAQ", icon: HelpCircle },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
];

const portalOptions = [
  { name: 'Student Login', href: '/login/student', icon: GraduationCap, color: 'text-blue-600' },
  { name: 'Teacher Login', href: '/login/teacher', icon: User, color: 'text-emerald-600' },
  { name: 'Parent Login', href: '/login/parent', icon: Users, color: 'text-purple-600' },
];

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 h-16 md:h-20 bg-white/95 backdrop-blur-md border-b border-stone-100 z-100 flex items-center">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 md:gap-3 z-110 shrink-0">
          <div className="w-9 h-9 md:w-12 md:h-12 relative">
            <Image src="/logo.jpg" alt="Logo" fill className="rounded-lg object-cover border border-stone-100" priority />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-[13px] sm:text-base md:text-xl text-stone-900 leading-tight">The Benedictine Academy</h1>
            <span className="text-[9px] md:text-xs text-stone-500 font-bold tracking-widest uppercase hidden xs:block">Excellence & Character</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                pathname === link.href ? 'text-orange-600' : 'text-stone-600 hover:text-orange-600 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Desktop Portal Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsLoginDropdownOpen(true)}
            onMouseLeave={() => setIsLoginDropdownOpen(false)}
          >
            <button 
              className={`flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                isLoginDropdownOpen ? 'text-orange-600 bg-stone-50' : 'text-stone-600 hover:text-orange-600'
              }`}
            >
              Login Portal
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLoginDropdownOpen && (
              <div className="absolute top-full right-0 w-48 py-2 mt-1 bg-white border border-stone-100 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                {portalOptions.map((option) => (
                  <Link
                    key={option.name}
                    href={option.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <option.icon className={`w-4 h-4 ${option.color}`} />
                    {option.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 z-110 shrink-0">
          <Link 
            href="/student-portal" 
            className="whitespace-nowrap bg-orange-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[11px] md:text-sm font-bold shadow-md hover:bg-orange-700 active:scale-95 transition-all"
          >
            Check Result
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}