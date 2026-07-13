'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Campaign } from '@/types/campaign.types';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { Check, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function ManageCampaignsClient() {
  const [filter, setFilter] = useState('all');

  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: ['admin-campaigns', filter],
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>(`/campaigns?status=${filter}&limit=100`);
      return res.data.data;
    },
  });

  const updateStatus = async (id: string, status: 'active' | 'rejected') => {
    try {
      const res = await api.patch(`/campaigns/${id}/status`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update campaign status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--cf-text)]">Manage Campaigns</h2>
          <p className="text-[var(--cf-text-muted)]">Review and moderate all platform campaigns.</p>
        </div>
        <select
          className="rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface)] px-4 py-2 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Campaigns</option>
          <option value="pending">Pending Review</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)] animate-pulse">Loading campaigns...</div>
        ) : !campaigns?.length ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)]">No campaigns found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)] border-b border-[var(--cf-border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Campaign</th>
                  <th className="px-6 py-4 font-medium">Creator</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Progress</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                {campaigns.map((c) => {
                  const progress = Math.min((c.raised_amount / c.funding_goal) * 100, 100);
                  
                  return (
                    <tr key={c.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.campaign_image_url} alt="" className="h-10 w-16 rounded object-cover" />
                          <div className="font-medium text-[var(--cf-text)] max-w-[200px] truncate">{c.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{c.creator_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                          c.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                          c.status === 'closed' ? 'bg-[var(--cf-text-muted)]/10 text-[var(--cf-text-muted)]' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-24">
                          <span className="font-medium text-xs">{formatCurrency(c.raised_amount)}</span>
                          <div className="h-1.5 w-full rounded-full bg-[var(--cf-surface-2)]">
                            <div className="h-full rounded-full bg-[var(--cf-primary)]" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button size="sm" variant="ghost" asChild title="View Public Page">
                          <Link href={`/campaigns/${c.id}`}><ExternalLink className="h-4 w-4 text-[var(--cf-text-muted)]" /></Link>
                        </Button>
                        
                        {(c.status === 'pending' || c.status === 'rejected') && (
                          <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500 hover:bg-emerald-500/10" onClick={() => updateStatus(c.id, 'active')} title="Approve">
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {(c.status === 'pending' || c.status === 'active') && (
                          <Button size="sm" variant="outline" className="text-rose-500 border-rose-500 hover:bg-rose-500/10" onClick={() => updateStatus(c.id, 'rejected')} title="Reject">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
