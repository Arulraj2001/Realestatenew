import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'emerald' | 'amber' | 'slate' | 'red';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'gold',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    gold: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'bg-amber-600/10 border-amber-600/30 text-amber-500',
    slate: 'bg-slate-800/90 border-slate-700 text-slate-100',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold tracking-wider uppercase border rounded-full shadow-sm',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
