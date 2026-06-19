import { HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-[1280px]',
};

export function Container({ size = 'lg', className = '', children, ...props }: ContainerProps) {
  return (
    <div className={`mx-auto px-4 md:px-6 lg:px-8 ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </div>
  );
}
