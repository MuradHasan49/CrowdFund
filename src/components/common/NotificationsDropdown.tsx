import { useState, useRef, useEffect } from 'react';
import { Bell, HandHeart, CheckCircle2, Wallet, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationsDropdown() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Generate some dummy notifications based on user role
  const getDummyNotifications = () => {
    if (!user) return [];

    const now = new Date();
    
    if (user.role === 'admin') {
      return [
        {
          id: 1,
          type: 'alert',
          title: 'New Withdrawal Request',
          message: 'Creator "Tech Innovations" requested 5,000 credits.',
          time: new Date(now.getTime() - 1000 * 60 * 30),
          icon: AlertCircle,
          color: 'text-[var(--cf-accent)]',
          bg: 'bg-[var(--cf-accent)]/10',
          read: false
        },
        {
          id: 2,
          type: 'success',
          title: 'Campaign Approved',
          message: 'You approved the "Eco-Friendly Backpack" campaign.',
          time: new Date(now.getTime() - 1000 * 60 * 60 * 2),
          icon: CheckCircle2,
          color: 'text-[var(--cf-secondary)]',
          bg: 'bg-[var(--cf-secondary)]/10',
          read: true
        }
      ];
    }

    if (user.role === 'creator') {
      return [
        {
          id: 1,
          type: 'contribution',
          title: 'New Contribution!',
          message: 'John Doe contributed 500 credits to your campaign.',
          time: new Date(now.getTime() - 1000 * 60 * 15),
          icon: HandHeart,
          color: 'text-[var(--cf-primary)]',
          bg: 'bg-[var(--cf-primary)]/10',
          read: false
        },
        {
          id: 2,
          type: 'success',
          title: 'Withdrawal Processed',
          message: 'Your withdrawal for 10,000 credits was approved.',
          time: new Date(now.getTime() - 1000 * 60 * 60 * 24),
          icon: Wallet,
          color: 'text-[var(--cf-secondary)]',
          bg: 'bg-[var(--cf-secondary)]/10',
          read: true
        }
      ];
    }

    return [
      {
        id: 1,
        type: 'success',
        title: 'Contribution Successful',
        message: 'Your contribution of 100 credits was approved!',
        time: new Date(now.getTime() - 1000 * 60 * 5),
        icon: CheckCircle2,
        color: 'text-[var(--cf-secondary)]',
        bg: 'bg-[var(--cf-secondary)]/10',
        read: false
      },
      {
        id: 2,
        type: 'alert',
        title: 'Low Credits',
        message: 'Your credit balance is getting low.',
        time: new Date(now.getTime() - 1000 * 60 * 60 * 48),
        icon: Wallet,
        color: 'text-[var(--cf-accent)]',
        bg: 'bg-[var(--cf-accent)]/10',
        read: true
      }
    ];
  };

  const notifications = getDummyNotifications();
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
                    const Icon = notification.icon;
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
                        
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notification.bg} ${!notification.read ? 'ml-2' : ''}`}>
                          <Icon className={`h-4 w-4 ${notification.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h4 className={`text-sm font-semibold truncate ${notification.read ? 'text-[var(--cf-text)]' : 'text-[var(--cf-primary)]'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[10px] text-[var(--cf-text-muted)] whitespace-nowrap">
                              {formatDistanceToNow(notification.time, { addSuffix: true })}
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
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-md px-3 py-1.5 text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)] transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
