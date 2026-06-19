type BadgeVariant = 'success' | 'warning' | 'info' | 'error' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-accent-successLight text-accent-successDark',
  warning: 'bg-feedback-warningLight text-feedback-warning',
  info: 'bg-highlight-blueLight text-highlight-blueDark',
  error: 'bg-feedback-errorLight text-feedback-error',
  neutral: 'bg-surface-offWhite text-brand-secondary',
};

export function Badge({ variant = 'neutral', className = '', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
