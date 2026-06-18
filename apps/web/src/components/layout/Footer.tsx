import Link from 'next/link';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-lg text-white">MotoFin</span>
            </div>
            <p className="text-sm leading-relaxed">
              Vehicle finance comparison platform. We help you find the best refinance rates from 9+
              partner banks.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#calculator" className="hover:text-white transition-colors">EMI Savings Calculator</Link></li>
              <li><Link href="/#calculator" className="hover:text-white transition-colors">Pre-Approval Check</Link></li>
              <li><Link href="/#calculator" className="hover:text-white transition-colors">Balance Transfer</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-6 py-6 border-t border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Lock size={14} />
            <span className="text-xs font-medium">SSL Secured</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck size={14} />
            <span className="text-xs font-medium">Data Privacy</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <KeyRound size={14} />
            <span className="text-xs font-medium">256-bit Encrypted</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MotoFin Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Disclaimer: All rates displayed are indicative. Final rates are subject to bank approval
            and document verification.
          </p>
        </div>
      </div>
    </footer>
  );
}
