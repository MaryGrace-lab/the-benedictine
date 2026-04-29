'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, 
  GraduationCap, 
  User, 
  Users, 
  Home, 
  Info, 
  BookOpen, 
  UserPlus, 
  Phone, 
  HelpCircle, 
  Newspaper, 
  Image as ImageIcon,
  MonitorPlay,
  LockKeyhole,
  X,
  Menu
} from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Handle Escape key and Resize
  useEffect(() => {
    const handleEvents = (e: any) => {
      if (e.key === "Escape" || (e.type === 'resize' && window.innerWidth >= 1024)) {
        setIsMobileMenuOpen(false);
        setIsLoginDropdownOpen(false);
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

  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-100 selection:text-orange-900 bg-white font-sans">
      {/* HEADER */}
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

      {/* MOBILE MENU - Grid Style */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-90 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div ref={menuRef} className="absolute top-72px inset-x-4 max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden flex flex-col animate-in slide-in-from-top-4 duration-300">
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[...navLinks, { href: "/login-portal", label: "Login Portal", icon: LockKeyhole }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                      pathname === link.href 
                        ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm' 
                        : 'bg-stone-50/50 border-transparent text-stone-600 active:bg-stone-100'
                    }`}
                  >
                    <link.icon className={`w-5 h-5 ${pathname === link.href ? 'text-orange-600' : 'text-stone-400'}`} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <p className="px-2 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">Secure Portals</p>
                {portalOptions.map((option) => (
                  <Link
                    key={option.name}
                    href={option.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 active:bg-stone-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <option.icon className={`w-5 h-5 ${option.color}`} />
                      </div>
                      <span className="text-sm font-bold text-stone-700">{option.name}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-stone-300 -rotate-90" />
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-stone-50 border-t border-stone-100 text-center">
              <p className="text-[11px] text-stone-400 font-medium italic">Learning Today, Leading Tomorrow</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pt-16 md:pt-20">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#1a0c04] text-stone-400 border-t border-white/5 pt-12 pb-8">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
            
            {/* 1. BRAND & MISSION (Span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="bg-white p-0.5 rounded shadow-sm" />
                <span className="font-bold text-lg text-white tracking-tight">The Benedictine Academy</span>
              </div>
              <p className="text-[13px] leading-relaxed opacity-70 max-w-sm">
                Empowering the next generation with values-based education, technical proficiency, and moral leadership in an ever-evolving world.
              </p>
              <div className="flex gap-3 pt-1">
                {['f', 'in', 'x'].map(social => (
                  <div key={social} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold uppercase hover:text-orange-500 hover:border-orange-500 transition-all cursor-pointer">
                    {social}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. QUICK LINKS (Span 2) */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-[11px] uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="space-y-2 text-[13px]">
                {navLinks.slice(0, 6).map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-orange-500 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. LOGIN PORTALS (Span 2) */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-[11px] uppercase tracking-widest mb-4">Login Portals</h4>
              <ul className="space-y-2 text-[13px]">
                {portalOptions.map((portal) => (
                  <li key={portal.name}>
                    <Link href={portal.href} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-orange-600/60"></span>
                      {portal.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. CONTACT & HOURS (Span 4) */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <div>
                <h4 className="text-white font-bold text-[11px] uppercase tracking-widest mb-4">Contact Details</h4>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex gap-2">
                    <span className="text-orange-500">📍</span>
                    <span>37, Old Mechanic Road, Off Siluko Road, Benin City.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500">📞</span>
                    <a href="tel:+2347059443788" className="hover:text-white transition-colors">+234 705 944 3788</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500">✉️</span>
                    <a href="mailto:thebenedictineacademy@gmail.com" className="hover:text-white transition-colors text-[12px]">thebenedictineacademy@gmail.com</a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold text-[11px] uppercase tracking-widest mb-3">School Hours</h4>
                <div className="max-w-60 space-y-1.5 text-[12px]">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="opacity-60">Mon — Thu</span>
                    <span className="text-stone-200">07:30 - 16:00</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="opacity-60">Friday</span>
                    <span className="text-stone-200">07:30 - 14:00</span>
                  </div>
                  <div className="flex justify-between text-orange-500 font-bold italic pt-0.5">
                    <span>Weekend</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
            <p className="opacity-40">© 2026 The Benedictine Academy. All rights reserved.</p>
            <div className="flex gap-6 opacity-40">
              <Link href="/privacy" className="hover:text-white transition-colors uppercase tracking-tighter">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors uppercase tracking-tighter">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}