import { Lock, ShieldCheck, KeyRound } from 'lucide-react';

const banks = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak', 'IndusInd', 'AU Bank'];

export function TrustBar() {
  return (
    <section className="bg-white border-y border-slate-100 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
          Compare rates from trusted partners
        </p>
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {banks.map((bank) => (
            <div
              key={bank}
              className="px-3 py-1.5 bg-slate-50 rounded-md text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {bank}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-6 mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock size={13} />
            <span className="text-xs font-medium">SSL</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck size={13} />
            <span className="text-xs font-medium">Privacy</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <KeyRound size={13} />
            <span className="text-xs font-medium">Encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
