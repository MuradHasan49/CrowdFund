'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/common/DashboardSidebar';
import { DashboardHeader } from '@/components/common/DashboardHeader';
import { useAuthStore } from '@/store/authStore';
import { useCreditStore } from '@/store/creditStore';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, isInitializing } = useAuthStore();
  const { fetchCredits } = useCreditStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitializing, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCredits();
    }
  }, [isAuthenticated, fetchCredits]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cf-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--cf-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--cf-bg)]">
      <DashboardSidebar 
        isMobileOpen={isMobileOpen} 
        onCloseMobile={() => setIsMobileOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onOpenMobile={() => setIsMobileOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
