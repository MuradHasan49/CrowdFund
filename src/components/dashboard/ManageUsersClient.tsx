'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { User } from '@/types/user.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Shield, Ban, CheckCircle, Search } from 'lucide-react';

export function ManageUsersClient() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      const res = await api.get<{ data: User[] }>(`/users?search=${searchTerm}`);
      return res.data.data;
    },
  });

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await api.patch(`/users/${id}/status`, { isActive: !currentStatus });
      if (res.data.success) {
        toast.success(res.data.message);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user status');
    }
  };

  const updateRole = async (id: string, role: string) => {
    try {
      const res = await api.patch(`/users/${id}/role`, { role });
      if (res.data.success) {
        toast.success(res.data.message);
        refetch();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--cf-text)]">Manage Users</h2>
          <p className="text-[var(--cf-text-muted)]">Control access and roles across the platform.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--cf-text-muted)]" />
          <Input 
            type="text" 
            placeholder="Search name or email..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)] animate-pulse">Loading users...</div>
        ) : !users?.length ? (
          <div className="p-12 text-center text-[var(--cf-text-muted)]">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--cf-surface-2)] text-[var(--cf-text-muted)] border-b border-[var(--cf-border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Credits</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--cf-surface-2)]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--cf-text)]">{user.name}</div>
                      <div className="text-xs text-[var(--cf-text-muted)]">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="rounded bg-[var(--cf-bg)] border border-[var(--cf-border)] px-2 py-1 text-xs focus:outline-none focus:border-[var(--cf-primary)] capitalize"
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        disabled={user.role === 'admin'}
                      >
                        <option value="supporter">Supporter</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-semibold">{(user.credits || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <Button 
                          size="sm" 
                          variant={user.isActive ? "outline" : "primary"}
                          className={user.isActive ? "text-rose-500 border-rose-500/50 hover:bg-rose-500/10" : "bg-emerald-500 hover:bg-emerald-600 text-white border-none"}
                          onClick={() => toggleStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? (
                            <><Ban className="h-4 w-4 mr-1" /> Block</>
                          ) : (
                            <><CheckCircle className="h-4 w-4 mr-1" /> Unblock</>
                          )}
                        </Button>
                      )}
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center text-xs text-[var(--cf-text-muted)]">
                          <Shield className="h-4 w-4 mr-1" /> Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
