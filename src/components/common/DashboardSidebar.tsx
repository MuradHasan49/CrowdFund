'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  Home, 
  Search, 
  HandHeart, 
  CreditCard, 
  History, 
  PlusCircle, 
  FolderOpen, 
  Banknote, 
  Users, 
  FileBox, 
  FileCheck, 
  PieChart,
  LogOut,
  UserCog
} from 'lucide-react';

const MENU_ITEMS = {
  supporter: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Explore Campaigns', href: '/campaigns', icon: Search },
    { name: 'My Contributions', href: '/dashboard/my-contributions', icon: HandHeart },
    { name: 'Purchase Credit', href: '/dashboard/purchase-credit', icon: CreditCard },
    { name: 'Payment History', href: '/dashboard/payment-history', icon: History },
    { name: 'Edit Profile', href: '/dashboard/profile', icon: UserCog },
  ],
  creator: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Explore Campaigns', href: '/campaigns', icon: Search },
    { name: 'Add New Campaign', href: '/dashboard/add-campaign', icon: PlusCircle },
    { name: 'My Campaigns', href: '/dashboard/my-campaigns', icon: FolderOpen },
    { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: Banknote },
    { name: 'Payment History', href: '/dashboard/payment-history', icon: History },
    { name: 'Edit Profile', href: '/dashboard/profile', icon: UserCog },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Manage Users', href: '/dashboard/manage-users', icon: Users },
    { name: 'Manage Campaigns', href: '/dashboard/manage-campaigns', icon: FileBox },
    { name: 'Withdrawal Requests', href: '/dashboard/withdrawal-requests', icon: FileCheck },
    { name: 'Edit Profile', href: '/dashboard/profile', icon: UserCog },
  ],
};

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function DashboardSidebar({ isMobileOpen, onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const role = user?.role || 'supporter';
  
  const links = MENU_ITEMS[role as keyof typeof MENU_ITEMS] || MENU_ITEMS.supporter;

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearUser();
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--cf-border)] bg-[var(--cf-surface)] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center border-b border-[var(--cf-border)] px-6">
          <Link href="/" className="flex items-center gap-2 group" onClick={onCloseMobile}>
            <div className="flex h-9 items-center justify-center rounded-lg overflow-hidden transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="CrowdFund Logo" className="h-full w-auto object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--cf-text)] group-hover:text-[var(--cf-primary)] transition-colors">
              CrowdFund
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cf-text-muted)]">
              {role} Menu
            </p>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[var(--cf-primary)]/10 text-[var(--cf-primary)]"
                      : "text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-2)] hover:text-[var(--cf-text)]"
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-[var(--cf-primary)]" : "text-[var(--cf-text-muted)] group-hover:text-[var(--cf-text)]"
                  )} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[var(--cf-border)] p-4 space-y-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--cf-surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--cf-text-muted)] transition-colors hover:bg-rose-500/10 hover:text-rose-500"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          
          <div className="rounded-xl bg-[var(--cf-surface-2)] p-4 text-center hidden lg:block">
            <p className="text-xs text-[var(--cf-text-muted)] mb-2">Need help?</p>
            <Link href="/contact" className="text-sm font-semibold text-[var(--cf-primary)] hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
