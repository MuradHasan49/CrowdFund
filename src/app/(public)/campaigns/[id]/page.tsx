import { CampaignDetailsClient } from '@/components/campaigns/CampaignDetailsClient';

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CampaignDetailsClient id={id} />;
}
