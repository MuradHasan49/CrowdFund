'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, HandHeart, CheckCircle2, Wallet, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Notification {
  id: string;
  type: 'success' | 'alert' | 'contribution' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const getIconProps = (type: string) => {
  switch (type) {
    case 'success': return { icon: CheckCircle2, color: 'text-[var(--cf-secondary)]', bg: 'bg-[var(--cf-secondary)]/10' };
    case 'alert': return { icon: AlertCircle, color: 'text-[var(--cf-accent)]', bg: 'bg-[var(--cf-accent)]/10' };
    case 'contribution': return { icon: HandHeart, color: 'text-[var(--cf-primary)]', bg: 'bg-[var(--cf-primary)]/10' };
    default: return { icon: Wallet, color: 'text-[var(--cf-text)]', bg: 'bg-[var(--cf-surface-2)]' };
  }
};

export function NotificationsDropdown() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await api.get<{ data: Notification[] }>('/notifications');
      return res.data.data;
    },
    enabled: !!user,
    refetchInterval: 30000, // Poll every 30s
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      setIsOpen(false);
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative rounded-full p-2 text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-2)] transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--cf-accent)] ring-2 ring-[var(--cf-surface)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-xl shadow-black/50 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--cf-border)] bg-[var(--cf-surface-2)]">
              <h3 className="text-sm font-bold text-[var(--cf-text)]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--cf-primary)] bg-[var(--cf-primary)]/10 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            {/* List */}
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-[var(--cf-text-muted)] opacity-20 mx-auto mb-2" />
                  <p className="text-xs text-[var(--cf-text-muted)]">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--cf-border)]/50">
                  {notifications.map((notification) => {
                    const { icon: Icon, color, bg } = getIconProps(notification.type);
                    return (
                      <div 
                        key={notification.id} 
                        className={`relative flex items-start gap-3 p-4 transition-colors hover:bg-[var(--cf-surface-2)] cursor-pointer ${
                          !notification.read ? 'bg-[var(--cf-primary)]/5' : ''
                        }`}
                      >
                        {!notification.read && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[var(--cf-primary)]" />
                        )}
                        
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${!notification.read ? 'ml-2' : ''}`}>
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h4 className={`text-sm font-semibold truncate ${notification.read ? 'text-[var(--cf-text)]' : 'text-[var(--cf-primary)]'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[10px] text-[var(--cf-text-muted)] whitespace-nowrap">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-[var(--cf-border)] p-2 bg-[var(--cf-surface-2)]/50">
                <button 
                  onClick={() => markAsReadMutation.mutate()}
                  disabled={markAsReadMutation.isPending || unreadCount === 0}
                  className="w-full rounded-md px-3 py-1.5 text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {markAsReadMutation.isPending ? 'Marking...' : 'Mark all as read'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
