'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-cta hover:shadow-cta-hover focus-visible:ring-green-500',
    secondary:
      'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white focus-visible:ring-blue-500',
    outline:
      'border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400',
    ghost:
      'text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-400',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-[52px] px-6 text-lg',
    xl: 'h-14 px-8 text-lg',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
