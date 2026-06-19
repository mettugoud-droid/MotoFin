import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-brand-primary text-white py-12 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent-success rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-h3 text-white">
                Moto<span className="text-accent-success">Fin</span>
              </span>
            </div>
            <p className="text-body-sm text-brand-muted">
              India&apos;s smart vehicle finance comparison platform. Compare rates from 9+ partner banks instantly.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-body-sm font-semibold text-white mb-3">Quick Links</h3>
            <nav aria-label="Footer navigation" className="space-y-2">
              <Link href="/about" className="block text-body-sm text-brand-muted hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/faq" className="block text-body-sm text-brand-muted hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="block text-body-sm text-brand-muted hover:text-white transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-body-sm font-semibold text-white mb-3">Legal</h3>
            <nav aria-label="Legal links" className="space-y-2">
              <Link href="/privacy" className="block text-body-sm text-brand-muted hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-body-sm text-brand-muted hover:text-white transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <p className="text-caption text-brand-muted">
            © {new Date().getFullYear()} MotoFin Technologies. All rights reserved. This is an indicative savings estimate. Final rates are subject to bank approval and document verification.
          </p>
        </div>
      </Container>
    </footer>
  );
}
