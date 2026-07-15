import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5', className)}
        {...props}
      >
        {children}
        {required && <span className="text-amber-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
