export interface Withdrawal {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: 'stripe' | 'bkash' | 'rocket' | 'nagad';
  account_number: string;
  withdraw_date: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
