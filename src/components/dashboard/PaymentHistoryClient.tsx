'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Withdrawal } from '@/types/withdrawal.types';
import { CreditPurchase } from '@/types/credit.types';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { DownloadCloud, ArrowUpRight } from 'lucide-react';

export function PaymentHistoryClient() {
  const { user } = useAuthStore();
  const isCreator = user?.role === 'creator';

  const { data: withdrawals, isLoading: isLoadingW } = useQuery({
    queryKey: queryKeys.withdrawals.mine,
    queryFn: async () => {
      const res = await api.get<{ data: Withdrawal[] }>('/withdrawals/mine');
      return res.data.data;
    },
    enabled: isCreator,
  });

  const { data: purchases, isLoading: isLoadingP } = useQuery({
    queryKey: ['credit-purchases'], // Didn't export in queryKeys yet, inline is fine
    queryFn: async () => {
      const res = await api.get<{ data: CreditPurchase[] }>('/credits/history');
      return res.data.data;
    },
    enabled: !isCreator,
  });

  const isLoading = isCreator ? isLoadingW : isLoadingP;
  const hasData = isCreator ? withdrawals?.length : purchases?.length;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--cf-text)]">Payment History</h2>
        <p className="text-[var(--cf-text-muted)]">
          {isCreator ? 'Record of your requested and processed payouts.' : 'Record of your credit purchases.'}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)] animate-pulse">Loading history...</div>
        ) : !hasData ? (
          <div className="p-16 text-center">
            <h3 className="text-xl font-bold text-[var(--cf-text)] mb-2">No history found</h3>
            <p className="text-[var(--cf-text-muted)]">You don't have any transaction records yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)] border-b border-[var(--cf-border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Credits</th>
                  <th className="px-6 py-4 font-medium">Amount (USD)</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                
                {isCreator && withdrawals?.map((w) => (
                  <tr key={w.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                    <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-rose-500 font-medium">
                        <ArrowUpRight className="h-4 w-4" /> Withdrawal
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--cf-text)]">-{w.withdrawal_credit.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[var(--cf-text-muted)]">{formatCurrency(w.withdrawal_amount)}</td>
                    <td className="px-6 py-4 capitalize">{w.payment_system}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        w.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}

                {!isCreator && purchases?.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                    <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[var(--cf-secondary)] font-medium">
                        <DownloadCloud className="h-4 w-4" /> Purchase
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--cf-text)]">+{p.credits_received.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[var(--cf-text-muted)]">{formatCurrency(p.amount_usd)}</td>
                    <td className="px-6 py-4 capitalize">{p.payment_method}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        p.status === 'failed' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
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
