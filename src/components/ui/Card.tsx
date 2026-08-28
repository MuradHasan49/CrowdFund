import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card Component
 * 
 * Consistent container primitive with defined radius (rounded-xl), background, and borders.
 * 
 * Props:
 * - padding: 'none' | 'sm' (p-4) | 'md' (p-6) | 'lg' (p-8)
 * - variant: 'default' | 'elevated' (adds shadow and hover lift)
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)]",
          {
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
            
            // Variants
            'shadow-sm': variant === 'default',
            'shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1': variant === 'elevated',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
