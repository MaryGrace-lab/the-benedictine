"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PortalDropdown from "./PortalDropdown";
import { navLinks } from "@/data/navigation";

interface DesktopNavProps {
  isLoginDropdownOpen: boolean;
  setIsLoginDropdownOpen: (val: boolean) => void;
}

const DesktopNav = ({ isLoginDropdownOpen, setIsLoginDropdownOpen }: DesktopNavProps) => {
  const pathname = usePathname();

  return (
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

      <PortalDropdown 
        isOpen={isLoginDropdownOpen}
        onMouseEnter={() => setIsLoginDropdownOpen(true)}
        onMouseLeave={() => setIsLoginDropdownOpen(false)}
      />
    </nav>
  );
};

export default DesktopNav;