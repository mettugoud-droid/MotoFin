import Link from 'next/link';
import { Container } from './Container';

export function Header() {
  return (
    <header role="banner" className="sticky top-0 z-50 bg-surface-white/95 backdrop-blur-sm border-b border-surface-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent-success rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-h3 text-brand-primary">
              Moto<span className="text-accent-success">Fin</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link href="/about" className="text-body-sm text-brand-secondary hover:text-brand-primary transition-colors">
              About
            </Link>
            <Link href="/faq" className="text-body-sm text-brand-secondary hover:text-brand-primary transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-body-sm text-brand-secondary hover:text-brand-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 text-brand-secondary hover:text-brand-primary"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </Container>
    </header>
  );
}
