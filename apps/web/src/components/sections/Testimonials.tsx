'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya S.',
    city: 'Bangalore',
    bank: 'HDFC Bank',
    saved: '₹3,100/mo',
    quote: 'Switched from 12.5% to 8.75%. The process was smooth and my callback came within 20 minutes!',
    rating: 5,
  },
  {
    name: 'Rahul M.',
    city: 'Mumbai',
    bank: 'ICICI Bank',
    saved: '₹4,200/mo',
    quote: 'Was paying 14% for 2 years without knowing I could refinance. MotoFin saved me lakhs.',
    rating: 5,
  },
  {
    name: 'Sneha K.',
    city: 'Hyderabad',
    bank: 'Axis Bank',
    saved: '₹2,800/mo',
    quote: 'Got a ₹2.5L top-up along with lower rate. Used it to renovate my home. Highly recommend!',
    rating: 5,
  },
];

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-20 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Real Customers, Real Savings
          </h2>
          <p className="text-slate-500">Join 50,000+ car owners who reduced their EMI</p>
        </div>

        {/* Testimonial Cards */}
        <div className="relative h-[220px] md:h-[180px]">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`absolute inset-0 bg-white rounded-2xl shadow-card border border-slate-100 p-6 md:p-8 transition-all duration-500 ${
                i === active
                  ? 'opacity-100 translate-y-0 scale-100'
                  : i === (active + 1) % testimonials.length
                  ? 'opacity-40 translate-y-3 scale-[0.97]'
                  : 'opacity-0 translate-y-6 scale-95'
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.city} · {t.bank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600 tabular-nums">{t.saved}</p>
                  <p className="text-[10px] text-slate-400">saved monthly</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-green-500' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
