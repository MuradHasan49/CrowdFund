import { WithdrawalRequestsClient } from '@/components/dashboard/WithdrawalRequestsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Withdrawal Requests | Admin | CrowdFund',
};

export default function WithdrawalRequestsPage() {
  return <WithdrawalRequestsClient />;
}
