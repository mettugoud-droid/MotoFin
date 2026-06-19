import { BANK_PARTNERS } from '@/lib/constants';

export function BankLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
      {BANK_PARTNERS.map((bank) => (
        <div
          key={bank.shortName}
          className="flex items-center justify-center w-16 h-10 md:w-20 md:h-12 opacity-70 hover:opacity-100 transition-opacity"
          title={bank.name}
        >
          {/* Placeholder for bank logos - uses text fallback until SVG assets are added */}
          <span className="text-caption md:text-body-sm font-semibold text-white/80 text-center leading-tight">
            {bank.shortName}
          </span>
        </div>
      ))}
    </div>
  );
}
