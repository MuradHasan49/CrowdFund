'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCreditStore } from '@/store/creditStore';
import { Menu, Bell, Wallet, User as UserIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CREDIT_PURCHASE_RATE } from '@/lib/constants';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DashboardHeaderProps {
  onOpenMobile: () => void;
}

export function DashboardHeader({ onOpenMobile }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { credits } = useCreditStore();

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) return 'Overview';
    const last = segments[segments.length - 1];
    return last.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--cf-border)] bg-[var(--cf-surface)] px-4 sm:px-6 lg:px-8">
      
      {/* Left side: Mobile menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="rounded-md p-2 text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-2)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div>
          <h1 className="text-lg font-bold text-[var(--cf-text)] hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Credits, Notifications, Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Credits Badge */}
        <div className="flex items-center gap-2 rounded-full border border-[var(--cf-border)] bg-[var(--cf-bg)] px-3 py-1.5 shadow-sm">
          <div className="flex items-center justify-center rounded-full bg-[var(--cf-primary)]/20 p-1">
            <Wallet className="h-4 w-4 text-[var(--cf-primary)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none text-[var(--cf-text)]">
              {credits.toLocaleString()} Credits
            </span>
            <span className="text-[10px] leading-none text-[var(--cf-text-muted)] mt-0.5">
              ≈ {formatCurrency(credits / CREDIT_PURCHASE_RATE)}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <button 
          className="relative rounded-full p-2 text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-2)] transition-colors"
          onClick={() => toast('No new notifications right now', { icon: '🔔' })}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--cf-accent)] ring-2 ring-[var(--cf-surface)]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-[var(--cf-border)] pl-4 sm:pl-6">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-semibold text-[var(--cf-text)]">{user?.name}</span>
            <span className="text-xs font-medium uppercase text-[var(--cf-primary)]">{user?.role}</span>
          </div>
          <Link href="/dashboard/profile" className="h-9 w-9 overflow-hidden rounded-full border-2 border-[var(--cf-border)] bg-[var(--cf-surface-2)] transition-transform hover:scale-105">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
            ) : user?.email ? (
              <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserIcon className="h-5 w-5 text-[var(--cf-text-muted)]" />
              </div>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
