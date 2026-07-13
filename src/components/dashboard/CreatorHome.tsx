'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Contribution } from '@/types/contribution.types';
import { Campaign } from '@/types/campaign.types';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { FolderOpen, TrendingUp, Inbox } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function CreatorHome() {
  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: queryKeys.campaigns.mine,
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>('/campaigns/mine');
      return res.data.data;
    },
  });

  const { data: pendingContributions, isLoading: isLoadingContribs, refetch: refetchContribs } = useQuery({
    queryKey: queryKeys.contributions.pending,
    queryFn: async () => {
      const res = await api.get<{ data: Contribution[] }>('/contributions/pending');
      return res.data.data;
    },
  });

  const totalRaised = campaigns?.reduce((sum, c) => sum + c.raised_amount, 0) || 0;
  const activeCampaignsCount = campaigns?.filter(c => c.status === 'active').length || 0;
  const pendingCount = pendingContributions?.length || 0;

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await api.patch(`/contributions/${id}/${action}`);
      if (res.data.success) {
        toast.success(`Contribution ${action}d successfully`);
        refetchContribs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || `Failed to ${action} contribution`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Raised"
          value={formatCurrency(totalRaised)}
          icon={TrendingUp}
          description="Across all campaigns"
        />
        <StatsCard
          title="Active Campaigns"
          value={activeCampaignsCount}
          icon={FolderOpen}
          description="Currently live"
        />
        <StatsCard
          title="Pending Contributions"
          value={pendingCount}
          icon={Inbox}
          description="Awaiting review"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--cf-text)]">Contributions to Review</h2>
        <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
          {isLoadingContribs ? (
            <div className="p-6 text-center text-[var(--cf-text-muted)] animate-pulse">Loading...</div>
          ) : !pendingContributions?.length ? (
            <div className="p-12 text-center text-[var(--cf-text-muted)]">
              No pending contributions to review right now.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Supporter</th>
                    <th className="px-6 py-4 font-medium">Campaign</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Message</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                  {pendingContributions.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--cf-surface-2)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--cf-text)]">{c.supporter_name}</div>
                        <div className="text-xs text-[var(--cf-text-muted)]">{c.supporter_email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{c.campaign_title}</td>
                      <td className="px-6 py-4 text-[var(--cf-secondary)] font-semibold">{formatCurrency(c.amount)}</td>
                      <td className="px-6 py-4 text-[var(--cf-text-muted)] max-w-[200px] truncate">
                        {c.message || <span className="italic">No message</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                            onClick={() => handleAction(c.id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-rose-500 border-rose-500 hover:bg-rose-500/10"
                            onClick={() => handleAction(c.id, 'reject')}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
