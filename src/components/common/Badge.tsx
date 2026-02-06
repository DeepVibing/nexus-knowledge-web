import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-[#1C1C1C] text-[#A0A0A0] border border-[#2A2A2A]',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-900',
    warning: 'bg-amber-950/60 text-amber-400 border border-amber-900',
    error: 'bg-red-950/60 text-red-400 border border-red-900',
    info: 'bg-[rgba(232,10,222,0.08)] text-[#E80ADE] border border-[rgba(232,10,222,0.2)]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
