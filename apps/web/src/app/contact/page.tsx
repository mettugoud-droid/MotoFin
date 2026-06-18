import React from 'react';
import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - MotoFin Support',
  description:
    'Get in touch with MotoFin. Customer support for car loan refinancing queries.',
  alternates: { canonical: 'https://motofin.in/contact' },
};

export default function ContactPage() {
  return (
    <div className="pt-24">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-slate-300">
            We&apos;re here to help with your car loan queries.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Get In Touch</h2>
              <div className="space-y-5">
                <ContactItem icon={Phone} title="Phone" detail="+91-8000-000-000" sub="Mon-Sat, 9 AM - 7 PM IST" />
                <ContactItem icon={Mail} title="Email" detail="support@motofin.in" sub="We respond within 24 hours" />
                <ContactItem icon={MapPin} title="Office" detail="Hyderabad, Telangana" sub="MotoFin Technologies Pvt. Ltd." />
                <ContactItem icon={Clock} title="Business Hours" detail="Mon - Sat: 9 AM - 7 PM" sub="Sunday: Closed" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Common Questions</h2>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <p className="text-sm text-slate-600 mb-4">Before reaching out, check our FAQ:</p>
                <ul className="space-y-3">
                  {['How does the calculator work?', 'Is my data safe?', 'What banks do you compare?', 'Do I need documents?', 'How long does refinancing take?'].map((q) => (
                    <li key={q}>
                      <a href="/faq" className="text-sm text-blue-600 hover:text-blue-700">{q}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 bg-green-50 rounded-xl p-6 border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">Need a callback?</h3>
                <p className="text-sm text-green-700 mb-3">Use our calculator and request a free callback.</p>
                <a href="/#calculator" className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800">Go to Calculator →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactItem({ icon: Icon, title, detail, sub }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; detail: string; sub: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-blue-600" />
      </div>
      <div>
        <p className="font-medium text-slate-800 text-sm">{title}</p>
        <p className="text-slate-700">{detail}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
