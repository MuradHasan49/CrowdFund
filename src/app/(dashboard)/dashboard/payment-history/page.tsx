import { PaymentHistoryClient } from '@/components/dashboard/PaymentHistoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment History | CrowdFund',
};

export default function PaymentHistoryPage() {
  return <PaymentHistoryClient />;
}
