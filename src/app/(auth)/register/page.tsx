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
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  photoUrl: z.string().url('Must be a valid URL'),
  role: z.enum(['supporter', 'creator']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'supporter',
    }
  });

  const selectedRole = watch('role');

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      // The server expects photoURL (capital URL)
      const { confirmPassword, photoUrl, ...rest } = data;
      const payload = { ...rest, photoURL: photoUrl };
      const res = await api.post('/auth/register', payload);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
      queryClient.setQueryData(queryKeys.auth.me, data.data);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[var(--cf-bg)] relative overflow-hidden">
      
      {/* Decorative gradient orb */}
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--cf-secondary)]/10 blur-[100px] pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-[var(--cf-text)]">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--cf-text-muted)]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[var(--cf-primary)] hover:text-[var(--cf-primary)]/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[var(--cf-surface)] py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-[var(--cf-border)]">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              id="photoUrl"
              label="Photo URL"
              type="url"
              placeholder="https://example.com/photo.jpg"
              {...register('photoUrl')}
              error={errors.photoUrl?.message}
            />

            <div>
              <label className="block text-sm font-medium text-[var(--cf-text-muted)] mb-1.5">
                I want to join as a
              </label>
              <select
                {...register('role')}
                className="flex h-11 w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface)] px-4 py-2.5 text-sm text-[var(--cf-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cf-primary)]"
              >
                <option value="supporter">Supporter (Fund Campaigns)</option>
                <option value="creator">Creator (Start Campaigns)</option>
              </select>
              {errors.role?.message && <p className="mt-1.5 text-xs text-[var(--cf-accent)]">{errors.role.message}</p>}
            </div>

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" className="w-full mt-2" isLoading={registerMutation.isPending}>
              Create Account
            </Button>
          </form>

          <SocialLoginButtons isLoading={registerMutation.isPending} role={selectedRole} />
        </div>
      </div>
    </div>
  );
}
