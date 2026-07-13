export interface Campaign {
  id: string;
  creator: {
    _id?: string;
    id: string;
    name: string;
    email?: string;
    photoUrl?: string;
  };
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  raised_amount: number;
  deadline: string;
  min_contribution: number;
  image_url: string;
  status: 'active' | 'funded' | 'failed' | 'paused';
  createdAt: string;
}
