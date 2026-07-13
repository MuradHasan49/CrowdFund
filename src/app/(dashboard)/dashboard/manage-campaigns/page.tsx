import { ManageCampaignsClient } from '@/components/dashboard/ManageCampaignsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Campaigns | Admin | CrowdFund',
};

export default function ManageCampaignsPage() {
  return <ManageCampaignsClient />;
}
