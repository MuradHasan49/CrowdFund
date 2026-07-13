export interface Contribution {
  id: string;
  campaign_id: string;
  campaign_title: string;
  supporter_id: string;
  supporter_name: string;
  supporter_email: string;
  amount: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
