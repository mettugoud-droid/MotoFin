import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-card-p lg:p-card-p-lg',
  lg: 'p-8',
};

export function Card({ padding = 'md', hoverable = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`card ${paddingClasses[padding]} ${hoverable ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
