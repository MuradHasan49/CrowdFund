'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';

interface SocialLoginButtonsProps {
  isLoading?: boolean;
  role?: 'supporter' | 'creator';
}

export function SocialLoginButtons({ isLoading, role = 'supporter' }: SocialLoginButtonsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const socialMutation = useMutation({
    mutationFn: async (data: { provider: 'google' | 'facebook'; token: string; role?: 'supporter' | 'creator' }) => {
      const res = await api.post('/auth/social', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
      queryClient.setQueryData(queryKeys.auth.me, data.data);
      toast.success('Social authentication successful!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Social authentication failed. Please try again.');
    },
  });

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      socialMutation.mutate({ provider: 'google', token: tokenResponse.access_token, role });
    },
    onError: () => {
      toast.error('Google Login Failed');
    },
  });

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--cf-border)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[var(--cf-surface)] px-2 text-[var(--cf-text-muted)]">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="w-full">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11 border-[var(--cf-border)] text-[var(--cf-text)] bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
            onClick={() => loginWithGoogle()}
            disabled={socialMutation.isPending || isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-gray-700 font-semibold">Google</span>
          </Button>
        </div>

        <div className="w-full">
          <FacebookLogin
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'dummy_id_prevent_crash'}
            callback={(response: any) => {
              if (response.accessToken) {
                socialMutation.mutate({ provider: 'facebook', token: response.accessToken, role });
              } else if (response.status !== "unknown") {
                toast.error('Facebook Login Failed');
              }
            }}
            render={(renderProps: any) => (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-11 border-[var(--cf-border)] text-white bg-[#1877F2] hover:bg-[#1877F2]/90 flex items-center justify-center gap-2"
                onClick={renderProps.onClick}
                disabled={socialMutation.isPending || isLoading}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Facebook</span>
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
}
