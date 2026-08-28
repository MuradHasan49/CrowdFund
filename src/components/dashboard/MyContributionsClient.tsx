'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Contribution } from '@/types/contribution.types';
import { formatCurrency } from '@/lib/utils';
import { CREDIT_PURCHASE_RATE } from '@/lib/constants';
import Link from 'next/link';

export function MyContributionsClient() {
  const { data: contributions, isLoading } = useQuery({
    queryKey: ['my-contributions'],
    queryFn: async () => {
      const res = await api.get<{ data: Contribution[] }>('/contributions/mine');
      return res.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--cf-text)]">My Contributions</h2>
        <p className="text-[var(--cf-text-muted)]">Track all the campaigns you have supported.</p>
      </div>

      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)] animate-pulse">Loading contributions...</div>
        ) : !contributions?.length ? (
          <div className="p-16 text-center">
            <h3 className="text-xl font-bold text-[var(--cf-text)] mb-2">No contributions yet</h3>
            <p className="text-[var(--cf-text-muted)] mb-6">You haven't backed any campaigns yet.</p>
            <Link 
              href="/campaigns"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--cf-primary)] px-6 font-semibold text-white transition-colors hover:bg-[var(--cf-primary)]/90"
            >
              Explore Campaigns
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)] border-b border-[var(--cf-border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Campaign</th>
                  <th className="px-6 py-4 font-medium">Credits Sent</th>
                  <th className="px-6 py-4 font-medium">USD Value</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                {contributions.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                    <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/campaigns/${c.campaign_id}`} className="font-medium text-[var(--cf-primary)] hover:underline">
                        {c.campaign_title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold">{c.amount.toLocaleString()} Cr</td>
                    <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                      {formatCurrency(c.amount / CREDIT_PURCHASE_RATE)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        c.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
