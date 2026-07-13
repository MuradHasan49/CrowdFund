'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
      queryClient.setQueryData(queryKeys.auth.me, data.data);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const fillDemo = (role: 'supporter' | 'creator' | 'admin') => {
    setValue('email', `${role}@demo.com`);
    setValue('password', '123456');
    toast.success(`${role} demo credentials filled`);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[var(--cf-bg)] relative overflow-hidden">
      
      {/* Decorative gradient orb */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--cf-primary)]/20 blur-[100px] pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-[var(--cf-text)]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--cf-text-muted)]">
          Or{' '}
          <Link href="/register" className="font-medium text-[var(--cf-primary)] hover:text-[var(--cf-primary)]/80 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[var(--cf-surface)] py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-[var(--cf-border)]">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="#" className="font-medium text-[var(--cf-primary)] hover:text-[var(--cf-primary)]/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--cf-border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[var(--cf-surface)] px-2 text-[var(--cf-text-muted)]">
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => fillDemo('supporter')}>
                Supporter
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => fillDemo('creator')}>
                Creator
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => fillDemo('admin')}>
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
