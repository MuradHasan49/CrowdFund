'use client';

import { useAuthStore } from '@/store/authStore';
import { SupporterHome } from '@/components/dashboard/SupporterHome';
import { CreatorHome } from '@/components/dashboard/CreatorHome';
import { AdminHome } from '@/components/dashboard/AdminHome';

export default function DashboardHome() {
  const { user } = useAuthStore();

  if (!user) return null;

  if (user.role === 'creator') {
    return <CreatorHome />;
  }

  if (user.role === 'admin') {
    return <AdminHome />;
  }

  return <SupporterHome />;
}
