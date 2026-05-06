'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, User, Users, Home, Info, BookOpen, UserPlus, Phone, HelpCircle, Newspaper, ImageIcon, LockKeyhole } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
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

export default function MobileMenu({ isOpen, onClose, menuRef }: MobileMenuProps) {
  const pathname = usePathname();
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="xl:hidden fixed inset-0 z-90 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div ref={menuRef} className="absolute top-[72px] inset-x-4 max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden flex flex-col animate-in slide-in-from-top-4 duration-300">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-2 gap-2 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
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

          {/* Login Portal Dropdown Section */}
          <div className="space-y-2">
            <button
              onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
              className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 active:bg-stone-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <LockKeyhole className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-bold text-stone-700">Login Portal</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isPortalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Portal Options - Show only when dropdown is open */}
            {isPortalDropdownOpen && (
              <div className="ml-4 space-y-2 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                {portalOptions.map((option) => (
                  <Link
                    key={option.name}
                    href={option.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100 active:bg-stone-50 transition-all hover:border-orange-200"
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className={`w-4 h-4 ${option.color}`} />
                      <span className="text-sm font-medium text-stone-600">{option.name}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-stone-300 -rotate-90" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-400 font-medium italic">Learning Today, Leading Tomorrow</p>
        </div>
      </div>
    </div>
  );
}