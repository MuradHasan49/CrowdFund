'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types/user.types';
import { Campaign } from '@/types/campaign.types';
import { StatsCard } from './StatsCard';
import { Users, FileBox, Clock, Coins } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { CREDIT_PURCHASE_RATE } from '@/lib/constants';

const COLORS = ['#6C47FF', '#00D4AA', '#FF6B35', '#F59E0B'];

export function AdminHome() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-stats-users'],
    queryFn: async () => {
      const res = await api.get<{ data: User[] }>('/users');
      return res.data.data;
    },
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['admin-stats-campaigns'],
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>('/campaigns?status=all&limit=100');
      return res.data.data;
    },
  });

  const isLoading = usersLoading || campaignsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-[var(--cf-surface)] animate-pulse" />
        ))}
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const pendingCampaigns = campaigns?.filter(c => c.status === 'pending').length || 0;
  const totalCredits = users?.reduce((acc, u) => acc + (u.credits || 0), 0) || 0;

  // Pie Chart Data: Users by Role
  const roleCounts = users?.reduce((acc: any, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  
  const userRoleData = [
    { name: 'Supporters', value: roleCounts?.supporter || 0 },
    { name: 'Creators', value: roleCounts?.creator || 0 },
    { name: 'Admins', value: roleCounts?.admin || 0 },
  ].filter(d => d.value > 0);

  // Bar Chart Data: Campaigns by Category
  const categoryCounts = campaigns?.reduce((acc: any, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const campaignCategoryData = Object.keys(categoryCounts || {}).map(cat => ({
    name: cat,
    count: categoryCounts[cat],
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[var(--cf-text)]">Admin Dashboard</h2>
        <p className="text-[var(--cf-text-muted)]">Platform overview and statistics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Campaigns"
          value={activeCampaigns}
          icon={FileBox}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Pending Approval"
          value={pendingCampaigns}
          icon={Clock}
          trend={pendingCampaigns > 0 ? { value: pendingCampaigns, isPositive: false } : undefined}
        />
        <StatsCard
          title="Total Platform Credits"
          value={`${totalCredits.toLocaleString()} Cr`}
          icon={Coins}
          description={`≈ ${formatCurrency(totalCredits / CREDIT_PURCHASE_RATE)}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role Chart */}
        <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6">
          <h3 className="text-lg font-bold text-[var(--cf-text)] mb-6">Users by Role</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--cf-surface-2)', borderColor: 'var(--cf-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--cf-text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {userRoleData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-[var(--cf-text-muted)]">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaigns by Category Chart */}
        <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6">
          <h3 className="text-lg font-bold text-[var(--cf-text)] mb-6">Campaigns by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cf-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--cf-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--cf-text-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'var(--cf-surface-2)' }}
                  contentStyle={{ backgroundColor: 'var(--cf-surface-2)', borderColor: 'var(--cf-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="var(--cf-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
