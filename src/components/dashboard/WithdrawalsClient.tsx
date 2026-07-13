'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Withdrawal } from '@/types/withdrawal.types';
import { Campaign } from '@/types/campaign.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { MIN_WITHDRAWAL_CREDITS, CREDIT_WITHDRAWAL_RATE } from '@/lib/constants';
import toast from 'react-hot-toast';
import { Banknote, CreditCard, ShieldAlert } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useCreditStore } from '@/store/creditStore';

export function WithdrawalsClient() {
  const { fetchCredits } = useCreditStore();
  const { data: campaigns } = useQuery({
    queryKey: queryKeys.campaigns.mine,
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>('/campaigns/mine');
      return res.data.data;
    },
  });

  const { data: withdrawals, isLoading, refetch } = useQuery({
    queryKey: queryKeys.withdrawals.mine,
    queryFn: async () => {
      const res = await api.get<{ data: Withdrawal[] }>('/withdrawals/mine');
      return res.data.data;
    },
  });

  const totalRaised = campaigns?.reduce((sum, c) => sum + c.raised_amount, 0) || 0;
  const totalWithdrawn = withdrawals?.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.withdrawal_credit, 0) || 0;
  const pendingWithdrawal = withdrawals?.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.withdrawal_credit, 0) || 0;
  const availableToWithdraw = totalRaised - totalWithdrawn - pendingWithdrawal;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    withdrawal_credit: '',
    payment_system: 'stripe',
    account_number: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const credits = Number(form.withdrawal_credit);
    
    if (credits < MIN_WITHDRAWAL_CREDITS) {
      toast.error(`Minimum withdrawal is ${MIN_WITHDRAWAL_CREDITS} credits.`);
      return;
    }
    if (credits > availableToWithdraw) {
      toast.error('You cannot withdraw more than your available balance.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/withdrawals', form);
      if (res.data.success) {
        toast.success(res.data.message);
        setForm({ ...form, withdrawal_credit: '', account_number: '' });
        refetch();
        fetchCredits();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit withdrawal request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountUsd = Number(form.withdrawal_credit) / CREDIT_WITHDRAWAL_RATE;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--cf-text)]">Withdrawals</h2>
        <p className="text-[var(--cf-text-muted)]">Manage your earnings and request payouts.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Raised"
          value={`${totalRaised.toLocaleString()} Credits`}
          icon={Banknote}
          description="Total from all campaigns"
        />
        <StatsCard
          title="Withdrawn & Pending"
          value={`${(totalWithdrawn + pendingWithdrawal).toLocaleString()} Credits`}
          icon={CreditCard}
        />
        <StatsCard
          title="Available to Withdraw"
          value={`${availableToWithdraw.toLocaleString()} Credits`}
          icon={Banknote}
          description={`≈ ${formatCurrency(availableToWithdraw / CREDIT_WITHDRAWAL_RATE)}`}
          className="border-[var(--cf-primary)]/50 bg-[var(--cf-primary)]/5"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Withdrawal Form */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-[var(--cf-text)] mb-4">Request Payout</h3>
            
            {availableToWithdraw < MIN_WITHDRAWAL_CREDITS ? (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-rose-500 mb-2" />
                <p className="text-sm font-medium text-rose-500">Insufficient Balance</p>
                <p className="text-xs text-[var(--cf-text-muted)] mt-1">
                  You need at least {MIN_WITHDRAWAL_CREDITS} credits to request a withdrawal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Credits to withdraw</label>
                  <Input 
                    type="number"
                    min={MIN_WITHDRAWAL_CREDITS}
                    max={availableToWithdraw}
                    required
                    value={form.withdrawal_credit}
                    onChange={(e) => setForm({...form, withdrawal_credit: e.target.value})}
                    placeholder={`Min. ${MIN_WITHDRAWAL_CREDITS}`}
                  />
                  <p className="text-xs text-[var(--cf-text-muted)] text-right">
                    Max: {availableToWithdraw.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <div className="rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface-2)] px-4 py-3 text-[var(--cf-text)] font-semibold font-mono">
                    {amountUsd > 0 ? formatCurrency(amountUsd) : '$0.00'}
                  </div>
                  <p className="text-xs text-[var(--cf-text-muted)]">Conversion rate: {CREDIT_WITHDRAWAL_RATE} credits = $1</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Payment Method</label>
                  <select
                    className="w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-4 py-3 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none"
                    value={form.payment_system}
                    onChange={(e) => setForm({...form, payment_system: e.target.value})}
                  >
                    <option value="stripe">Stripe</option>
                    <option value="bkash">bKash</option>
                    <option value="rocket">Rocket</option>
                    <option value="nagad">Nagad</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Account Number / Email</label>
                  <Input 
                    required
                    value={form.account_number}
                    onChange={(e) => setForm({...form, account_number: e.target.value})}
                    placeholder="Enter your account details"
                  />
                </div>

                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Withdraw Funds'}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-[var(--cf-text)]">Withdrawal History</h3>
          <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-[var(--cf-text-muted)] animate-pulse">Loading history...</div>
            ) : !withdrawals?.length ? (
              <div className="p-12 text-center text-[var(--cf-text-muted)]">
                You haven't made any withdrawal requests yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Credits</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Method</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                        <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                          {new Date(w.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium">{w.withdrawal_credit.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[var(--cf-secondary)] font-semibold">{formatCurrency(w.withdrawal_amount)}</td>
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
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
