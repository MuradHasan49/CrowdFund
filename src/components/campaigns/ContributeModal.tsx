'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { X, HandCoins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

interface ContributeModalProps {
  campaignId: string;
  minContribution: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ContributeModal({ campaignId, minContribution, isOpen, onClose, onSuccess }: ContributeModalProps) {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [amount, setAmount] = useState<number | ''>(minContribution);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 shadow-2xl">
          <div className="text-center">
            <HandCoins className="mx-auto mb-4 h-12 w-12 text-[var(--cf-primary)]" />
            <h2 className="mb-2 text-2xl font-bold text-[var(--cf-text)]">Login to Contribute</h2>
            <p className="mb-6 text-[var(--cf-text-muted)]">
              You need an account to support this amazing project.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push('/login')}>Go to Login</Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < minContribution) {
      toast.error(`Minimum contribution is ${minContribution} credits.`);
      return;
    }
    if (amount > (user?.credits || 0)) {
      toast.error('Insufficient credits. Please purchase more.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post(`/contributions`, {
        campaign_id: campaignId,
        amount: Number(amount),
        message: message.trim(),
      });

      if (res.data.success) {
        toast.success('Contribution successful! Thank you for your support.');
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me }); // Refresh user credits
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to contribute.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--cf-border)] bg-[var(--cf-surface-2)] p-4">
          <h2 className="text-lg font-bold text-[var(--cf-text)]">Contribute to Campaign</h2>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface)] hover:text-[var(--cf-text)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 rounded-lg bg-[var(--cf-bg)] p-4 text-center border border-[var(--cf-border)]">
            <p className="text-sm text-[var(--cf-text-muted)]">Available Balance</p>
            <p className="text-3xl font-extrabold text-[var(--cf-primary)]">{(user?.credits || 0).toLocaleString()} <span className="text-base font-medium">Credits</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--cf-text)]">
                Contribution Amount <span className="text-[var(--cf-text-muted)]">(Min: {minContribution})</span>
              </label>
              <div className="relative">
                <HandCoins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--cf-text-muted)]" />
                <Input
                  type="number"
                  min={minContribution}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || '')}
                  className="pl-10 text-lg"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--cf-text)]">
                Message of Support <span className="text-[var(--cf-text-muted)]">(Optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface)] px-4 py-3 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-primary)]"
                rows={3}
                placeholder="Cheer on the creator..."
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                Confirm Contribution
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
