'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Campaign } from '@/types/campaign.types';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export function TopFundedCampaigns() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.campaigns.top,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Campaign[] }>('/campaigns/top');
      return res.data.data;
    },
  });

  return (
    <section className="py-24 bg-[var(--cf-bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--cf-text)] sm:text-4xl">
              Top Funded Campaigns
            </h2>
            <p className="mt-4 text-lg text-[var(--cf-text-muted)]">
              Discover the projects that our community is backing the most right now.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/campaigns">View All Campaigns</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[300px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--cf-primary)]" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-[var(--cf-accent)]/20 bg-[var(--cf-accent)]/10 p-8 text-center text-[var(--cf-accent)]">
            Failed to load top campaigns. Please try again later.
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.slice(0, 8).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-12 text-center text-[var(--cf-text-muted)]">
            No active campaigns found.
          </div>
        )}
      </div>
    </section>
  );
}
