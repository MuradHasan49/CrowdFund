import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--cf-text-muted)] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'flex h-11 w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface)] px-4 py-3 text-sm text-[var(--cf-text)] transition-colors',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-[var(--cf-text-muted)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cf-primary)] disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-[var(--cf-accent)] focus-visible:ring-[var(--cf-accent)]',
              isPassword && 'pr-10', // Add padding for the icon
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-[var(--cf-accent)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
