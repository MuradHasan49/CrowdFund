import Link from 'next/link';
import { Campaign } from '@/types/campaign.types';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Clock, TrendingUp } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  className?: string;
}

export function CampaignCard({ campaign, className }: CampaignCardProps) {
  const progress = Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[var(--cf-primary)]/10 hover:-translate-y-1", className)}>
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={campaign.image_url || `https://picsum.photos/seed/${campaign.id}/800/450`}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-full bg-[var(--cf-bg)]/80 px-2.5 py-1 text-xs font-semibold text-[var(--cf-text)] backdrop-blur-md border border-[var(--cf-border)]">
          {campaign.category}
        </div>
        {campaign.status !== 'active' && (
          <div className="absolute top-3 right-3 rounded-full bg-[var(--cf-accent)] px-2.5 py-1 text-xs font-semibold text-white uppercase tracking-wider">
            {campaign.status}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-[var(--cf-text-muted)] mb-2">
          <span>By {campaign.creator.name}</span>
        </div>

        <h3 className="text-lg font-bold text-[var(--cf-text)] line-clamp-1 mb-2">
          {campaign.title}
        </h3>
        
        <p className="text-sm text-[var(--cf-text-muted)] line-clamp-2 mb-4 flex-1">
          {campaign.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-[var(--cf-secondary)]">{formatCurrency(campaign.raised_amount)}</span>
              <span className="text-[var(--cf-text-muted)]">of {formatCurrency(campaign.goal_amount)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--cf-surface-2)]">
              <div 
                className="h-full rounded-full bg-[var(--cf-secondary)] transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--cf-text-muted)] border-t border-[var(--cf-border)] pt-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[var(--cf-primary)]" />
              <span>{Math.round(progress)}% Funded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{daysLeft} days left</span>
            </div>
          </div>

          <Button asChild className="w-full">
            <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
