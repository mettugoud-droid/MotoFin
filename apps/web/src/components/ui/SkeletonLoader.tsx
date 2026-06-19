interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedClasses = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

export function SkeletonLoader({ width, height = '1rem', rounded = 'md', className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${roundedClasses[rounded]} ${className}`}
      style={{ width: width || '100%', height }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
