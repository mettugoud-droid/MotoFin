'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className={`font-bold text-lg ${scrolled ? 'text-slate-800' : 'text-white'}`}>
            MotoFin
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#calculator"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            Calculator
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            About
          </Link>
          <Link
            href="/faq"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {scrolled && (
            <Link
              href="/#calculator"
              className="hidden sm:inline-flex bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 animate-fade-in"
            >
              Check Savings
            </Link>
          )}
          <a
            href="tel:+918000000000"
            className={`flex items-center gap-1.5 text-sm font-medium ${
              scrolled ? 'text-slate-600' : 'text-white/80'
            }`}
          >
            <Phone size={16} />
            <span className="hidden sm:inline">Support</span>
          </a>
        </div>
      </div>
    </header>
  );
}
