'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Contribution } from '@/types/contribution.types';
import { Campaign } from '@/types/campaign.types';
import { useCreditStore } from '@/store/creditStore';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HandHeart, Wallet, Target, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import Link from 'next/link';

export function SupporterHome() {
  const { credits } = useCreditStore();

  const { data: contributions, isLoading: isLoadingContribs } = useQuery({
    queryKey: queryKeys.contributions.mine,
    queryFn: async () => {
      const res = await api.get<{ data: Contribution[] }>('/contributions/mine');
      return res.data.data;
    },
  });

  const { data: recommended, isLoading: isLoadingRecs } = useQuery({
    queryKey: queryKeys.campaigns.top,
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>('/campaigns/top');
      return res.data.data.slice(0, 3);
    },
  });

  const totalContributions = contributions?.length || 0;
  const creditsSpent = contributions?.reduce((sum, c) => sum + c.amount, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Contributions"
          value={totalContributions}
          icon={HandHeart}
          description="Campaigns backed"
        />
        <StatsCard
          title="Credits Spent"
          value={formatCurrency(creditsSpent)}
          icon={Target}
          description="Total amount pledged"
        />
        <StatsCard
          title="Available Balance"
          value={formatCurrency(credits)}
          icon={Wallet}
          description="Ready to support"
        />
      </div>

      <div className="space-y-12">
        {/* Recent Contributions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--cf-text)]">Recent Contributions</h2>
            <Link href="/dashboard/my-contributions" className="text-sm font-medium text-[var(--cf-primary)] hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
            {isLoadingContribs ? (
              <div className="p-6 text-center text-[var(--cf-text-muted)] animate-pulse">Loading...</div>
            ) : !contributions?.length ? (
              <div className="p-12 text-center text-[var(--cf-text-muted)]">
                You haven't made any contributions yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Campaign</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                    {contributions.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-[var(--cf-surface-2)]/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{c.campaign_title}</td>
                        <td className="px-6 py-4 text-[var(--cf-secondary)] font-semibold">{formatCurrency(c.amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                            c.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Campaigns */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--cf-text)]">Recommended for you</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingRecs ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-[400px] rounded-xl bg-[var(--cf-surface)] animate-pulse" />)
            ) : (
              recommended?.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
