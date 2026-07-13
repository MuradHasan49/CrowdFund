import { ButtonHTMLAttributes, forwardRef, cloneElement, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, asChild, ...props }, ref) => {
    
    const classes = cn(
      'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cf-primary disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-[var(--cf-primary)] text-white hover:bg-[var(--cf-primary)]/90 shadow-lg shadow-[var(--cf-primary)]/20': variant === 'primary',
        'bg-[var(--cf-secondary)] text-black hover:bg-[var(--cf-secondary)]/90': variant === 'secondary',
        'border border-[var(--cf-border)] bg-transparent hover:bg-[var(--cf-surface-2)] text-[var(--cf-text)]': variant === 'outline',
        'bg-transparent hover:bg-[var(--cf-surface-2)] text-[var(--cf-text)]': variant === 'ghost',
        'bg-[var(--cf-accent)] text-white hover:bg-[var(--cf-accent)]/90 shadow-lg shadow-[var(--cf-accent)]/20': variant === 'danger',
        'h-9 px-3 text-xs': size === 'sm',
        'h-11 px-5 py-2.5 text-sm': size === 'md',
        'h-14 px-8 text-base': size === 'lg',
      },
      className
    );

    if (asChild && children && typeof children === 'object' && 'props' in (children as any)) {
      const child = children as ReactElement;
      return cloneElement(child, {
        className: cn(classes, (child.props as any).className),
        ...props
      } as any);
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

