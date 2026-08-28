import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge Component
 * 
 * Small pill for status indicators, tags, or categories.
 * 
 * Props:
 * - variant: 'default' | 'success' | 'warning' | 'danger' | 'neutral'
 */

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        {
          'bg-[var(--cf-primary)]/10 text-[var(--cf-primary)] border border-[var(--cf-primary)]/20': variant === 'default',
          'bg-[var(--cf-secondary)]/10 text-[var(--cf-secondary)] border border-[var(--cf-secondary)]/20': variant === 'success',
          'bg-amber-500/10 text-amber-500 border border-amber-500/20': variant === 'warning',
          'bg-[var(--cf-accent)]/10 text-[var(--cf-accent)] border border-[var(--cf-accent)]/20': variant === 'danger',
          'bg-[var(--cf-surface-2)] text-[var(--cf-text)] border border-[var(--cf-border)]': variant === 'neutral',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
