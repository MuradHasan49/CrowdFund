import { AddCampaignClient } from '@/components/dashboard/AddCampaignClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Campaign | CrowdFund',
};

export default function AddCampaignPage() {
  return <AddCampaignClient />;
}
