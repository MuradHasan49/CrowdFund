import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Skeleton Component
 * 
 * Loading placeholder with pulse animation.
 * 
 * Props:
 * - variant: 'text' | 'circular' | 'rectangular'
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--cf-surface-2)]",
        {
          'rounded-md h-4': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-xl': variant === 'rectangular',
        },
        className
      )}
      {...props}
    />
  );
}
