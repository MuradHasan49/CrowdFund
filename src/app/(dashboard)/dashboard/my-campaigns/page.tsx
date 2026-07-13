import { MyCampaignsClient } from '@/components/dashboard/MyCampaignsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Campaigns | CrowdFund',
};

export default function MyCampaignsPage() {
  return <MyCampaignsClient />;
}
