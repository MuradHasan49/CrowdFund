import { CampaignsClient } from '@/components/campaigns/CampaignsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Campaigns | CrowdFund',
  description: 'Discover innovative projects and support creators on CrowdFund.',
};

export default function CampaignsPage() {
  return <CampaignsClient />;
}
