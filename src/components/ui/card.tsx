import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glass';
}

export const Card: React.FC<CardProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg',
    bordered: 'bg-slate-950 border border-slate-700/60 text-slate-100',
    glass: 'bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-slate-100',
  };

  return (
    <div className={cn('rounded-xl overflow-hidden transition-all duration-200', variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('px-6 py-5 border-b border-slate-800/80', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('px-6 py-5', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
