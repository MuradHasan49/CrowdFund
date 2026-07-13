'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { CREDIT_PURCHASE_RATE } from '@/lib/constants';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Wallet, ShieldCheck, Loader2 } from 'lucide-react';
import { useCreditStore } from '@/store/creditStore';

export function PurchaseCreditClient() {
  const [amountUsd, setAmountUsd] = useState<string>('50');
  const [isProcessing, setIsProcessing] = useState(false);
  const { fetchCredits } = useCreditStore();

  const creditsReceived = Number(amountUsd) * CREDIT_PURCHASE_RATE;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountUsd);

    if (amount < 1) {
      toast.error('Minimum purchase is $1');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Initiating secure payment...');

    try {
      // Simulate Stripe/payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await api.post('/credits/purchase', {
        amount_usd: amount,
        payment_method: 'stripe',
        payment_intent_id: `pi_mock_${Date.now()}`
      });

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setAmountUsd('');
        // Refresh global credits state
        fetchCredits();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Payment failed. Please try again.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const presetAmounts = [10, 50, 100, 250];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--cf-text)] mb-2">Buy Credits</h2>
        <p className="text-[var(--cf-text-muted)]">
          Credits are the universal currency on CrowdFund. 
          Use them to back any campaign instantly.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--cf-border)]">
          <div>
            <p className="text-sm font-medium text-[var(--cf-text-muted)] mb-1">Exchange Rate</p>
            <p className="text-xl font-bold text-[var(--cf-text)]">
              $1.00 USD = <span className="text-[var(--cf-primary)]">{CREDIT_PURCHASE_RATE} Credits</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-[var(--cf-primary)]/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-[var(--cf-primary)]" />
          </div>
        </div>

        <form onSubmit={handlePurchase} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--cf-text)]">Select or enter amount</label>
            <div className="grid grid-cols-4 gap-3">
              {presetAmounts.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmountUsd(preset.toString())}
                  className={`py-2 px-1 rounded-lg border text-sm font-semibold transition-all ${
                    Number(amountUsd) === preset 
                      ? 'bg-[var(--cf-primary)] border-[var(--cf-primary)] text-white shadow-lg shadow-[var(--cf-primary)]/30' 
                      : 'border-[var(--cf-border)] bg-[var(--cf-bg)] text-[var(--cf-text)] hover:border-[var(--cf-primary)]/50'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            
            <div className="relative mt-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-[var(--cf-text-muted)] font-bold">$</span>
              </div>
              <Input 
                type="number"
                min="1"
                step="1"
                required
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                className="pl-8 text-lg font-bold py-4 h-auto bg-[var(--cf-bg)]"
                placeholder="Custom amount"
              />
            </div>
          </div>

          <div className="rounded-xl bg-[var(--cf-surface-2)] p-4 border border-[var(--cf-border)]">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-[var(--cf-text-muted)]">Amount</span>
              <span className="font-semibold text-[var(--cf-text)]">{amountUsd ? formatCurrency(Number(amountUsd)) : '$0.00'}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-[var(--cf-text-muted)]">Processing Fee</span>
              <span className="font-semibold text-[var(--cf-secondary)]">Free</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-[var(--cf-border)]">
              <span className="font-medium text-[var(--cf-text)]">You'll receive</span>
              <span className="text-xl font-black text-[var(--cf-primary)]">
                {creditsReceived.toLocaleString()} Credits
              </span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg shadow-lg shadow-[var(--cf-primary)]/25"
            disabled={isProcessing || !amountUsd || Number(amountUsd) < 1}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Payment...
              </>
            ) : (
              <>Pay {amountUsd ? formatCurrency(Number(amountUsd)) : '$0.00'}</>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--cf-text-muted)]">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Secured by mock payment gateway
          </p>
        </form>
      </div>
    </div>
  );
}
