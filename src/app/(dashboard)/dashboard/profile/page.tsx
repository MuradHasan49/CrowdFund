'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Camera, Loader2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState(user?.name || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUploading, setIsUploading] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; photoURL?: string }) => {
      const res = await api.patch('/auth/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data);
        queryClient.setQueryData(queryKeys.auth.me, data.data);
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Using ImgBB for image hosting
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        setPhotoURL(data.data.url);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    updateProfileMutation.mutate({ name, photoURL });
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--cf-text)]">Edit Profile</h1>
        <p className="text-[var(--cf-text-muted)]">Update your personal information and profile picture.</p>
      </div>

      <div className="bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full border-4 border-[var(--cf-bg)] overflow-hidden bg-[var(--cf-surface-2)] shadow-md">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="h-full w-full object-cover" />
                ) : user.email ? (
                  <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-10 w-10 text-[var(--cf-text-muted)]" />
                  </div>
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
              >
                {isUploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-medium text-[var(--cf-text)]">Profile Picture</h3>
              <p className="text-xs text-[var(--cf-text-muted)] mt-1 mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
              <div className="flex gap-3 justify-center sm:justify-start">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={isUploading}
                >
                  Change Picture
                </Button>
                {photoURL && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-[var(--cf-accent)] hover:text-[var(--cf-accent)] hover:bg-[var(--cf-accent)]/10"
                    onClick={() => setPhotoURL('')}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <hr className="border-[var(--cf-border)]" />

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
              <Input
                label="Email Address"
                id="email"
                value={user.email}
                disabled
                className="opacity-70 cursor-not-allowed bg-[var(--cf-bg)]"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Role"
                id="role"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                disabled
                className="opacity-70 cursor-not-allowed bg-[var(--cf-bg)]"
              />
              <Input
                label="Available Credits"
                id="credits"
                value={user.credits.toLocaleString()}
                disabled
                className="opacity-70 cursor-not-allowed bg-[var(--cf-bg)]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              isLoading={updateProfileMutation.isPending}
              disabled={isUploading || (!name.trim()) || (name === user.name && photoURL === (user.photoURL || ''))}
            >
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
