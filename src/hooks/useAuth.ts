import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore, User } from '@/store/authStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch current session (uses cf_token cookie automatically)
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: User }>('/auth/me');
      return res.data.data;
    },
    retry: false, // Don't retry if unauthorized
  });

  // Sync React Query data to Zustand
  useEffect(() => {
    if (isLoading) {
      setInitializing(true);
      return;
    }

    if (data) {
      setUser(data);
    } else if (isError) {
      clearUser();
    }
    setInitializing(false);
  }, [data, isLoading, isError, setUser, clearUser, setInitializing]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      clearUser();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      toast.error('Failed to log out');
    },
  });

  return {
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
