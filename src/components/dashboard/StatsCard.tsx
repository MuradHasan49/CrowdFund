import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, description, trend, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 shadow-sm flex flex-col justify-between", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--cf-text-muted)]">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--cf-surface-2)]">
          <Icon className="h-5 w-5 text-[var(--cf-primary)]" />
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-extrabold text-[var(--cf-text)]">{value}</p>
        
        {(description || trend) && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {trend && (
              <span className={cn(
                "font-medium",
                trend.isPositive ? "text-[var(--cf-secondary)]" : "text-[var(--cf-accent)]"
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="text-[var(--cf-text-muted)]">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
