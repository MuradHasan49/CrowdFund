'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { uploadImage } from '@/lib/uploadImage';
import toast from 'react-hot-toast';
import { ImagePlus, Loader2 } from 'lucide-react';

const CATEGORIES = ['Technology', 'Art', 'Community', 'Health', 'Education', 'Other'];

export function AddCampaignClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    campaign_story: '',
    category: 'Technology',
    funding_goal: '',
    minimum_contribution: '',
    deadline: '',
    reward_info: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error('Please upload a campaign image.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const toastId = toast.loading('Uploading image...');
      const imageUrl = await uploadImage(imageFile);
      
      toast.loading('Submitting campaign...', { id: toastId });
      
      const res = await api.post('/campaigns', {
        ...formData,
        funding_goal: Number(formData.funding_goal),
        minimum_contribution: Number(formData.minimum_contribution),
        campaign_image_url: imageUrl,
      });

      if (res.data.success) {
        toast.success('Campaign submitted successfully for review!', { id: toastId });
        router.push('/dashboard/my-campaigns');
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || error.response?.data?.error || 'Failed to submit campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--cf-text)]">Create New Campaign</h2>
        <p className="text-[var(--cf-text-muted)]">Share your project with the world and gather support.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 md:p-8 shadow-sm">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--cf-text)]">Campaign Title</label>
          <Input 
            required 
            placeholder="E.g., Revolutionary Smart Watch"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            maxLength={100}
          />
        </div>

        {/* Category & Deadline */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cf-text)]">Category</label>
            <select
              required
              className="w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-4 py-3 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-primary)]"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cf-text)]">Deadline</label>
            <Input 
              required 
              type="date"
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </div>

        {/* Financials */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cf-text)]">Funding Goal (Credits)</label>
            <Input 
              required 
              type="number"
              min="100"
              placeholder="Min. 100"
              value={formData.funding_goal}
              onChange={(e) => setFormData({ ...formData, funding_goal: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--cf-text)]">Minimum Contribution (Credits)</label>
            <Input 
              required 
              type="number"
              min="1"
              placeholder="Min. 1"
              value={formData.minimum_contribution}
              onChange={(e) => setFormData({ ...formData, minimum_contribution: e.target.value })}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--cf-text)]">Campaign Image</label>
          <div className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--cf-border)] bg-[var(--cf-bg)] transition-colors hover:bg-[var(--cf-surface-2)] overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              required={!imageFile}
              onChange={handleImageChange}
              className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <ImagePlus className="mx-auto h-10 w-10 text-[var(--cf-text-muted)] mb-3" />
                <p className="text-sm text-[var(--cf-text-muted)]">Click or drag image to upload</p>
                <p className="text-xs text-[var(--cf-text-muted)]/70 mt-1">Max size: 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Story */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--cf-text)]">Campaign Story</label>
          <textarea
            required
            rows={5}
            className="w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-4 py-3 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-primary)]"
            placeholder="Tell supporters why they should back your project..."
            value={formData.campaign_story}
            onChange={(e) => setFormData({ ...formData, campaign_story: e.target.value })}
          />
        </div>

        {/* Rewards */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--cf-text)]">Reward Information</label>
          <textarea
            required
            rows={3}
            className="w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-4 py-3 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-primary)]"
            placeholder="What will supporters get for their contributions?"
            value={formData.reward_info}
            onChange={(e) => setFormData({ ...formData, reward_info: e.target.value })}
          />
        </div>

        <div className="pt-4 border-t border-[var(--cf-border)] flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : 'Submit Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
}
