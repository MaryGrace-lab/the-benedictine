"use client";

// ──────────────────────────────────────────────
// Public Header — Client Component
// Navigation bar with portal login dropdown.
// CSS hover-based dropdown for reliability.
// ──────────────────────────────────────────────
//app/(public)/components/PublicLayout/Header.tsx
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown, GraduationCap, User, ShieldCheck,
  Home, Info, BookOpen, UserPlus, Phone, HelpCircle,
  Newspaper, ImageIcon, X, Menu,
} from "lucide-react";

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
  { name: "Admin Portal", href: "/admin-portal/login", icon: ShieldCheck, color: "text-red-600" },
  { name: "Teacher Portal", href: "/teacher-portal/login", icon: User, color: "text-emerald-600" },
  { name: "Student Portal", href: "/student-portal/login", icon: GraduationCap, color: "text-blue-600" },
];

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 h-16 md:h-20 bg-white/95 backdrop-blur-md border-b border-stone-100 z-50 flex items-center">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo – now flexible */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 md:w-12 md:h-12 relative flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="The Benedictine Academy Logo"
              fill
              sizes="(max-width: 768px) 36px, 48px"
              className="rounded-lg object-cover border border-stone-100"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-bold text-[13px] sm:text-base md:text-xl text-stone-900 leading-tight truncate">
              The Benedictine Academy
            </h1>
            <span className="text-[9px] md:text-xs text-stone-500 font-bold tracking-widest uppercase hidden sm:block">
              Excellence & Character
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                pathname === link.href
                  ? "text-orange-600"
                  : "text-stone-600 hover:text-orange-600 hover:bg-stone-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Portal Dropdown — CSS hover for reliability */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all text-stone-600 group-hover:text-orange-600 group-hover:bg-stone-50"
            >
              Login Portal
              <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            {/* Dropdown — stays visible on hover */}
            <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="w-48 bg-white border border-stone-100 rounded-xl shadow-xl py-2">
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
            </div>
          </div>
        </nav>

        {/* Right side: CTA + Mobile toggle – now responsive */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link
            href="/student-portal/login"
            className="hidden md:flex whitespace-nowrap bg-orange-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[11px] md:text-sm font-bold shadow-md hover:bg-orange-700 active:scale-95 transition-all"
          >
            Check Result
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors flex-shrink-0"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}