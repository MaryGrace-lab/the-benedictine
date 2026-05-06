import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admission", label: "Admission" },
  { href: "/contact", label: "Contact" },
  { href: "/FAQ", label: "FAQ" },
];

const portalOptions = [
  { name: 'Student Login', href: '/login/student' },
  { name: 'Teacher Login', href: '/login/teacher' },
  { name: 'Parent Login', href: '/login/parent' },
];

export default function Footer() {
  return (
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
              {navLinks.map(l => (
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
          <Link href="/privacy" className="hover:text-white transition-colors uppercase tracking-tighter">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors uppercase tracking-tighter">
            Terms of Service
          </Link>
        </div>
        </div>
      </div>
    </footer>
  );
}