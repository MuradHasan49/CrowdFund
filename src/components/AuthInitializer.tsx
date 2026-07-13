'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Mount the hook to fetch the user automatically on app load
  useAuth();
  
  const isInitializing = useAuthStore((state) => state.isInitializing);

  // Optional: Return a full-screen loading spinner while hydrating, 
  // or just return children if you want optimistic rendering.
  // For standard dashboards, it's often safer to block rendering until auth resolves.
  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--cf-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--cf-primary)] border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
