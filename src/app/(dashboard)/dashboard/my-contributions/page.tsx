import { MyContributionsClient } from '@/components/dashboard/MyContributionsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Contributions | CrowdFund',
};

export default function MyContributionsPage() {
  return <MyContributionsClient />;
}
