import { TrendingDown, PlusCircle, Zap, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: TrendingDown,
    title: 'Save ₹2,000 – ₹5,000/month',
    description: 'Lower interest rates from 8.5% across 9+ partner banks.',
  },
  {
    icon: PlusCircle,
    title: 'Get Top-Up on Existing Loan',
    description: 'Access additional funds of up to ₹5 Lakh on your existing car loan.',
  },
  {
    icon: Zap,
    title: 'Quick 30-Second Check',
    description: 'No documents needed upfront. Instant savings estimation.',
  },
  {
    icon: ShieldCheck,
    title: '100% Safe & Confidential',
    description: 'Bank-grade encryption. No spam. Your data stays private.',
  },
];

export function Benefits() {
  return (
    <section className="py-16 md:py-20 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-10">
          Why Refinance Your Car Loan?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-slate-100"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
