'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Withdrawal } from '@/types/withdrawal.types';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export function WithdrawalRequestsClient() {
  const { data: withdrawals, isLoading, refetch } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      const res = await api.get<{ data: Withdrawal[] }>('/withdrawals');
      return res.data.data;
    },
  });

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await api.patch(`/withdrawals/${id}/${action}`);
      if (res.data.success) {
        toast.success(res.data.message);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || `Failed to ${action} withdrawal`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--cf-text)]">Withdrawal Requests</h2>
        <p className="text-[var(--cf-text-muted)]">Review and process creator payouts.</p>
      </div>

      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)] animate-pulse">Loading requests...</div>
        ) : !withdrawals?.length ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)]">No withdrawal requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)] border-b border-[var(--cf-border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Creator</th>
                  <th className="px-6 py-4 font-medium">Credits / Amount</th>
                  <th className="px-6 py-4 font-medium">Method / Account</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                    <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{w.creator_name}</div>
                      <div className="text-xs text-[var(--cf-text-muted)]">{w.creator_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{w.withdrawal_credit.toLocaleString()} Cr</div>
                      <div className="text-[var(--cf-secondary)] font-medium">{formatCurrency(w.withdrawal_amount)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="capitalize font-medium">{w.payment_system}</div>
                      <div className="text-xs text-[var(--cf-text-muted)] font-mono">{w.account_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        w.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {w.status === 'pending' ? (
                        <>
                          <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500 hover:bg-emerald-500/10" onClick={() => handleAction(w.id, 'approve')} title="Approve">
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-rose-500 border-rose-500 hover:bg-rose-500/10" onClick={() => handleAction(w.id, 'reject')} title="Reject">
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-[var(--cf-text-muted)] text-xs italic">Processed</span>
                      )}
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
