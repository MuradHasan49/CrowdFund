import { PurchaseCreditClient } from '@/components/dashboard/PurchaseCreditClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy Credits | CrowdFund',
};

export default function PurchaseCreditPage() {
  return <PurchaseCreditClient />;
}
