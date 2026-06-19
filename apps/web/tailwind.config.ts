import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: '360px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        brand: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        accent: {
          success: '#22C55E',
          successDark: '#16A34A',
          successLight: '#DCFCE7',
        },
        highlight: {
          blue: '#3B82F6',
          blueDark: '#2563EB',
          blueLight: '#DBEAFE',
        },
        surface: {
          white: '#FFFFFF',
          offWhite: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        feedback: {
          error: '#EF4444',
          errorLight: '#FEF2F2',
          warning: '#F59E0B',
          warningLight: '#FFFBEB',
        },
        confidence: {
          high: '#22C55E',
          moderate: '#F59E0B',
          low: '#F97316',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['2.25rem', { lineHeight: '1.1', fontWeight: '800' }],
        h1: ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        'section-y': '4rem',
        'section-y-lg': '6rem',
        'card-p': '1.5rem',
        'card-p-lg': '2rem',
        'stack-sm': '0.5rem',
        'stack-md': '1rem',
        'stack-lg': '1.5rem',
        'inline-sm': '0.5rem',
        'inline-md': '1rem',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'count-up': 'countUp 0.6s ease-out forwards',
        check: 'checkDraw 0.5s ease-in-out 0.3s forwards',
        shimmer: 'shimmer 1.5s infinite',
        'step-pulse': 'stepPulse 2s infinite',
        'progress-fill': 'progressFill 0.6s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        checkDraw: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        progressFill: {
          from: { width: '0%' },
          to: { width: 'var(--progress-width)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        stepPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)' },
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
