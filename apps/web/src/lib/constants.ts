export const BANK_PARTNERS = [
  { name: 'HDFC Bank', shortName: 'HDFC', logo: '/images/banks/hdfc.svg' },
  { name: 'ICICI Bank', shortName: 'ICICI', logo: '/images/banks/icici.svg' },
  { name: 'Axis Bank', shortName: 'Axis', logo: '/images/banks/axis.svg' },
  { name: 'Kotak Mahindra Bank', shortName: 'Kotak', logo: '/images/banks/kotak.svg' },
  { name: 'IndusInd Bank', shortName: 'IndusInd', logo: '/images/banks/indusind.svg' },
  { name: 'AU Small Finance Bank', shortName: 'AU', logo: '/images/banks/au.svg' },
] as const;

export const CALCULATOR_STEPS = [
  { id: 1, title: 'Loan Details', description: 'Enter your current EMI and loan amount' },
  { id: 2, title: 'Interest Rate', description: 'Your current interest rate' },
  { id: 3, title: 'Tenure', description: 'Remaining and original tenure' },
  { id: 4, title: 'Review', description: 'Review and calculate savings' },
] as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect. Please check your internet and try again.',
  SERVER: 'Something went wrong. Please try again in a moment.',
  VALIDATION: 'Please check your inputs and try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
} as const;

export const SITE_CONFIG = {
  name: 'MotoFin',
  fullName: 'MotoFin Technologies',
  tagline: 'Reduce Your Car EMI in 30 Seconds',
  description: 'Check how much you could save on your car loan in 30 seconds. Compare rates from 9+ banks. Free, instant results.',
  url: 'https://motofin.in',
  keywords: [
    'car loan refinance',
    'vehicle loan balance transfer',
    'reduce car EMI',
    'car loan top-up',
    'vehicle loan foreclosure',
    'used car loan',
    'auto loan transfer',
    'car loan interest rate',
  ],
} as const;
