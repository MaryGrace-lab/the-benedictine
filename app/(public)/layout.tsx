import Link from "next/link";
import Image from "next/image";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b sticky top-0 z-50">
        {/* LEFT SIDE: Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0">
          <Image 
            src="/logo.jpg" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="rounded-sm"
            style={{ width: 'auto', height: 'auto' }} 
            priority
          />
          <h1 className="font-bold text-lg md:text-xl tracking-tight hidden sm:block">
            The Benedictine Academy
          </h1>
        </Link>

        {/* RIGHT SIDE: Navigation */}
        <nav className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-orange-600 transition-colors">About</Link>
            <Link href="/academics" className="hover:text-orange-600 transition-colors">Academics</Link>
            <Link href="/admission" className="hover:text-orange-600 transition-colors">Admission</Link>
            <Link href="/contact" className="hover:text-orange-600 transition-colors">Contact</Link>
            <Link href="/FAQ" className="hover:text-orange-600 transition-colors">FAQ</Link>
            <Link href="/news" className="hover:text-orange-600 transition-colors">News</Link>
            <Link href="/gallery" className="hover:text-orange-600 transition-colors">Gallery</Link>
            <Link href="/facilities" className="hover:text-orange-600 transition-colors">Facilities</Link>
          </div>

          <Link 
            href="/student-portal" 
            className="bg-orange-700 text-white px-5 py-2 rounded-full text-xs md:text-sm font-bold hover:bg-orange-800 transition-all shadow-sm whitespace-nowrap"
          >
            Student Login
          </Link>
        </nav>
      </header>

      {/* PAGE CONTENT: This is where page.tsx is injected */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#241a16] text-white border-t border-white/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="bg-white p-1 rounded" />
                <span className="font-bold text-lg">The Benedictine Academy</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nurturing minds, building character, and shaping the future since 2017.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/admission" className="hover:text-white transition-colors">Admissions</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">Latest News</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/FAQ" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/student-portal" className="hover:text-white transition-colors">Student Portal</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>📍 37, Old Mechanic Road, Benin City.</li>
                <li>📞 +234 705 944 3788</li>
                <li>✉️ thebenedictineacademy@gmail.com</li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Hours</h4>
              <div className="text-sm text-gray-400 space-y-2">
                <p>Mon - Thu: 7:30 AM - 4:00 PM</p>
                <p>Fri: 7:30 AM - 2:00 PM</p>
                <p className="text-orange-500/80 font-semibold">Weekend: Closed</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-gray-500">
            © 2026 The Benedictine Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}