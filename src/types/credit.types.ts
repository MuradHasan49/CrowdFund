export interface CreditPurchase {
  id: string;
  user_id: string;
  user_email: string;
  amount_usd: number;
  credits_received: number;
  payment_method: string;
  payment_intent_id?: string;
  status: 'completed' | 'failed' | 'pending';
  createdAt: string;
}
