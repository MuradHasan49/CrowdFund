'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Campaign } from '@/types/campaign.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function MyCampaignsClient() {
  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: queryKeys.campaigns.mine,
    queryFn: async () => {
      const res = await api.get<{ data: Campaign[] }>('/campaigns/mine');
      return res.data.data;
    },
  });

  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);

  const [editForm, setEditForm] = useState({
    title: '',
    campaign_story: '',
    reward_info: '',
  });

  const openEditModal = (c: Campaign) => {
    setEditingCampaign(c);
    setEditForm({
      title: c.title,
      campaign_story: c.campaign_story,
      reward_info: c.reward_info,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    try {
      const res = await api.patch(`/campaigns/${editingCampaign.id}`, editForm);
      if (res.data.success) {
        toast.success('Campaign updated successfully');
        setEditingCampaign(null);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update campaign');
    }
  };

  const handleDelete = async () => {
    if (!deletingCampaign) return;

    try {
      const res = await api.delete(`/campaigns/${deletingCampaign.id}`);
      if (res.data.success) {
        toast.success(res.data.message || 'Campaign deleted');
        setDeletingCampaign(null);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete campaign');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--cf-text)]">My Campaigns</h2>
          <p className="text-[var(--cf-text-muted)]">Manage your fundraising projects.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/add-campaign">Add New Campaign</Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)] animate-pulse">Loading campaigns...</div>
        ) : !campaigns?.length ? (
          <div className="p-16 text-center">
            <h3 className="text-xl font-bold text-[var(--cf-text)] mb-2">No campaigns found</h3>
            <p className="text-[var(--cf-text-muted)] mb-6">You haven't created any campaigns yet.</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/add-campaign">Create your first campaign</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)] border-b border-[var(--cf-border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Campaign</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Raised / Goal</th>
                  <th className="px-6 py-4 font-medium">Deadline</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                {campaigns.map((c) => {
                  const progress = Math.min((c.raised_amount / c.funding_goal) * 100, 100);
                  
                  return (
                    <tr key={c.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.campaign_image_url} alt="" className="h-10 w-16 rounded object-cover" />
                          <div className="font-medium text-[var(--cf-text)] max-w-[200px] truncate">{c.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                          c.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                          c.status === 'closed' ? 'bg-[var(--cf-text-muted)]/10 text-[var(--cf-text-muted)]' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">{formatCurrency(c.raised_amount)}</span>
                            <span className="text-[var(--cf-text-muted)]">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[var(--cf-surface-2)]">
                            <div className="h-full rounded-full bg-[var(--cf-primary)]" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--cf-text-muted)]">
                        {new Date(c.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button size="sm" variant="ghost" asChild title="View Public Page">
                          <Link href={`/campaigns/${c.id}`}><ExternalLink className="h-4 w-4 text-[var(--cf-text-muted)]" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(c)} title="Edit">
                          <Pencil className="h-4 w-4 text-[var(--cf-primary)]" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeletingCampaign(c)} title="Delete">
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--cf-border)] p-4 bg-[var(--cf-surface-2)]">
              <h3 className="font-bold text-lg">Update Campaign</h3>
              <button onClick={() => setEditingCampaign(null)} className="p-1 hover:bg-[var(--cf-surface)] rounded text-[var(--cf-text-muted)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Story</label>
                <textarea 
                  rows={4} 
                  required
                  className="w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-4 py-3 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none"
                  value={editForm.campaign_story} 
                  onChange={e => setEditForm({...editForm, campaign_story: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reward Info</label>
                <textarea 
                  rows={3} 
                  required
                  className="w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-4 py-3 text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none"
                  value={editForm.reward_info} 
                  onChange={e => setEditForm({...editForm, reward_info: e.target.value})} 
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setEditingCampaign(null)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 shadow-2xl text-center">
            <Trash2 className="mx-auto h-12 w-12 text-rose-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Delete Campaign?</h3>
            <p className="text-[var(--cf-text-muted)] mb-2">
              Are you sure you want to delete <span className="font-bold text-[var(--cf-text)]">{deletingCampaign.title}</span>?
            </p>
            <p className="text-sm text-rose-500/80 mb-6 bg-rose-500/10 p-3 rounded-lg">
              This action cannot be undone. All pending contributions will be rejected and approved contributions will be refunded to supporters.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setDeletingCampaign(null)}>Cancel</Button>
              <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white border-none" onClick={handleDelete}>Delete Permanently</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
