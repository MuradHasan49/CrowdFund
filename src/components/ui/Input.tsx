import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--cf-text-muted)] mb-1.5">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface)] px-4 py-3 text-sm text-[var(--cf-text)] transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-[var(--cf-text-muted)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cf-primary)] disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--cf-accent)] focus-visible:ring-[var(--cf-accent)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[var(--cf-accent)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
