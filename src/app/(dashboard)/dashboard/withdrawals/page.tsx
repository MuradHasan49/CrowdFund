import { WithdrawalsClient } from '@/components/dashboard/WithdrawalsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Withdrawals | CrowdFund',
};

export default function WithdrawalsPage() {
  return <WithdrawalsClient />;
}
