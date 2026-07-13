'use client';

import { useAuthStore } from '@/store/authStore';
import { SupporterHome } from '@/components/dashboard/SupporterHome';
import { CreatorHome } from '@/components/dashboard/CreatorHome';

export default function DashboardHome() {
  const { user } = useAuthStore();

  if (!user) return null;

  if (user.role === 'creator') {
    return <CreatorHome />;
  }

  if (user.role === 'admin') {
    return (
      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-12 text-center">
        <h2 className="text-2xl font-bold text-[var(--cf-text)] mb-2">Admin Dashboard</h2>
        <p className="text-[var(--cf-text-muted)]">Use the sidebar to manage platform data.</p>
      </div>
    );
  }

  return <SupporterHome />;
}
