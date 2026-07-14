'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Campaign } from '@/types/campaign.types';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Clock, TrendingUp, Users, Target, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ContributeModal } from '@/components/campaigns/ContributeModal';
import { CampaignCard } from '@/components/campaigns/CampaignCard';

export function CampaignDetailsClient({ id }: { id: string }) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: campaign, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Campaign }>(`/campaigns/${id}`);
      return res.data.data;
    },
  });

  const { data: relatedCampaigns } = useQuery({
    queryKey: [...queryKeys.campaigns.all({ category: campaign?.category }), 'related'],
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>(`/campaigns?category=${campaign?.category}&limit=4`);
      return res.data.data.filter(c => c.id !== id).slice(0, 4);
    },
    enabled: !!campaign?.category,
  });

  if (isLoading) {
    return (
      <div className="py-24 bg-[var(--cf-bg)] min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
          <div className="h-[400px] w-full rounded-2xl bg-[var(--cf-surface)]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-[var(--cf-surface)] rounded" />
              <div className="h-32 w-full bg-[var(--cf-surface)] rounded" />
            </div>
            <div className="h-[300px] w-full bg-[var(--cf-surface)] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="py-24 bg-[var(--cf-bg)] min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--cf-text)]">Campaign not found</h2>
          <p className="mt-2 text-[var(--cf-text-muted)]">It may have been removed or the URL is incorrect.</p>
        </div>
      </div>
    );
  }

  const progress = Math.min((campaign.raised_amount / campaign.funding_goal) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
  const isCreator = user?.id === campaign.creator_id;
  const isClosed = campaign.status !== 'active';

  return (
    <div className="bg-[var(--cf-bg)] pb-24">
      {/* Hero Image */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-[400px] w-full lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={campaign.campaign_image_url || `https://picsum.photos/seed/${campaign.id}/1600/900`}
            alt={campaign.title}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--cf-bg)] via-[var(--cf-bg)]/60 to-transparent" />
          
          <div className="absolute bottom-0 w-full z-20">
            <div className="p-8 md:p-12">
              <div className="inline-block rounded-full bg-[var(--cf-primary)] px-3 py-1 text-sm font-semibold text-white mb-4 shadow-lg">
                {campaign.category}
              </div>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl drop-shadow-md">
                {campaign.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-[var(--cf-text)] mb-6 border-b border-[var(--cf-border)] pb-2">
                About this campaign
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--cf-text-muted)] leading-relaxed whitespace-pre-wrap">
                {campaign.campaign_story}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[var(--cf-text)] mb-6 border-b border-[var(--cf-border)] pb-2 flex items-center gap-2">
                <Target className="text-[var(--cf-secondary)]" /> Reward Info
              </h2>
              <div className="rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6">
                <p className="text-[var(--cf-text-muted)] leading-relaxed whitespace-pre-wrap">
                  {campaign.reward_info}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--cf-primary)] bg-[var(--cf-primary)]/10 p-3 rounded-lg w-fit">
                  <ShieldCheck className="h-5 w-5" /> Minimum Contribution: {formatCurrency(campaign.minimum_contribution)}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sticky top-24 h-fit">
            
            {/* Funding Card */}
            <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 shadow-xl">
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[var(--cf-secondary)]">{formatCurrency(campaign.raised_amount)}</span>
                <span className="text-sm font-medium text-[var(--cf-text-muted)]">raised</span>
              </div>
              <p className="text-sm text-[var(--cf-text-muted)] mb-6">
                pledged of {formatCurrency(campaign.funding_goal)} goal
              </p>

              <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--cf-surface-2)] mb-6">
                <div 
                  className="h-full rounded-full bg-[var(--cf-secondary)] transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--cf-text)] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--cf-primary)]" /> {Math.round(progress)}%
                  </span>
                  <span className="text-xs text-[var(--cf-text-muted)]">funded</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--cf-text)] flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[var(--cf-primary)]" /> {daysLeft}
                  </span>
                  <span className="text-xs text-[var(--cf-text-muted)]">days to go</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full text-lg mb-3 shadow-lg shadow-[var(--cf-primary)]/20"
                disabled={isCreator || isClosed}
                onClick={() => setIsModalOpen(true)}
              >
                {isCreator 
                  ? 'You are the creator' 
                  : isClosed 
                  ? `Campaign ${campaign.status}` 
                  : 'Back this project'}
              </Button>
              <p className="text-center text-xs text-[var(--cf-text-muted)]">
                All or nothing. This project will only be funded if it reaches its goal by {new Date(campaign.deadline).toLocaleDateString()}.
              </p>
            </div>

            {/* Creator Card */}
            <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)]">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--cf-text)]">{campaign.creator_name}</h3>
                  <p className="text-xs text-[var(--cf-text-muted)]">Campaign Creator</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => alert('Contact feature coming soon!')}>
                Contact Creator
              </Button>
            </div>

          </div>
        </div>

        {/* Related Campaigns */}
        {relatedCampaigns && relatedCampaigns.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[var(--cf-border)]">
            <h2 className="text-2xl font-bold text-[var(--cf-text)] mb-8">
              More in {campaign.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCampaigns.map(rc => (
                <CampaignCard key={rc.id} campaign={rc} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ContributeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaignId={campaign.id}
        minContribution={campaign.minimum_contribution}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
