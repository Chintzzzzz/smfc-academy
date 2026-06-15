'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Squad', href: '/squad' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black border-b border-yellow-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Club identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black font-black text-xs">SM</span>
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-sm tracking-wide">ST MIRREN FC</p>
            <p className="text-yellow-400 text-xs tracking-widest uppercase">Academy</p>
          </div>
        </Link>

        {/* Nav links */}
        <ul className="flex gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded ${
                    active
                      ? 'bg-yellow-400 text-black'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
