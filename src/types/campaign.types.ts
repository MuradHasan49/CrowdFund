export interface Campaign {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  title: string;
  campaign_story: string;
  category: string;
  funding_goal: number;
  minimum_contribution: number;
  reward_info: string;
  campaign_image_url: string;
  raised_amount: number;
  deadline: string;
  status: 'pending' | 'active' | 'rejected' | 'closed';
  createdAt: string;
}
