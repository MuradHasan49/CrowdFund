'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Menu, X, Coins, LogOut, LayoutDashboard, ChevronDown, UserCog, Home, Compass, Info, Phone, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CREDIT_PURCHASE_RATE } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationsDropdown } from './NotificationsDropdown';

export default function Navbar() {
  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--cf-border)] bg-[var(--cf-bg)]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 items-center justify-center rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="CrowdFund Logo" className="h-full w-auto object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--cf-text)] group-hover:text-[var(--cf-primary)] transition-colors">
                CrowdFund
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link
                href="/"
                className={`flex items-center text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-[var(--cf-primary)]'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                <Home className="mr-1.5 h-4 w-4" />
                Home
              </Link>
              <Link
                href="/campaigns"
                className={`flex items-center text-sm font-medium transition-colors ${
                  isActive('/campaigns')
                    ? 'text-[var(--cf-primary)]'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                <Compass className="mr-1.5 h-4 w-4" />
                Explore
              </Link>
              <Link
                href="/about"
                className={`flex items-center text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'text-[var(--cf-primary)]'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                <Info className="mr-1.5 h-4 w-4" />
                About
              </Link>
              <Link
                href="/contact"
                className={`flex items-center text-sm font-medium transition-colors ${
                  isActive('/contact')
                    ? 'text-[var(--cf-primary)]'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                <Phone className="mr-1.5 h-4 w-4" />
                Contact
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center text-sm font-medium transition-colors ${
                      isActive('/dashboard') ? 'text-[var(--cf-primary)]' : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                    }`}
                  >
                    <LayoutDashboard className="mr-1.5 h-4 w-4" />
                    Dashboard
                  </Link>

                  {user.role !== 'admin' && (
                    <Link
                      href="/dashboard/purchase-credit"
                      className={`flex items-center text-sm font-medium transition-colors ${
                        isActive('/dashboard/purchase-credit') ? 'text-[var(--cf-primary)]' : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                      }`}
                    >
                      <CreditCard className="mr-1.5 h-4 w-4" />
                      Buy Credits
                    </Link>
                  )}

                  <div className="flex items-center gap-2 rounded-full bg-[var(--cf-surface-2)] px-3 py-1.5 border border-[var(--cf-border)]">
                    <Coins className="h-4 w-4 text-[var(--cf-secondary)]" />
                    <span className="text-sm font-semibold text-[var(--cf-text)]">
                      {user.credits}
                    </span>
                    <span className="text-xs text-[var(--cf-text-muted)]">
                      ({formatCurrency(user.credits / CREDIT_PURCHASE_RATE)})
                    </span>
                  </div>

                  <NotificationsDropdown />

                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 focus:outline-none"
                    >
                      <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--cf-border)]">
                        <img
                          src={user.photoURL || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email}`}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <ChevronDown className="h-4 w-4 text-[var(--cf-text-muted)]" />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] py-1 shadow-lg shadow-black/50"
                        >
                          <div className="px-4 py-2 border-b border-[var(--cf-border)] mb-1">
                            <p className="text-sm font-medium text-[var(--cf-text)] truncate">{user.name}</p>
                            <p className="text-xs text-[var(--cf-text-muted)] capitalize">{user.role}</p>
                          </div>
                          
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-2)] hover:text-[var(--cf-text)]"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>

                          <Link
                            href="/dashboard/profile"
                            className="flex items-center px-4 py-2 text-sm text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-2)] hover:text-[var(--cf-text)]"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            Edit Profile
                          </Link>
                          
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              logout();
                            }}
                            disabled={isLoggingOut}
                            className="flex w-full items-center px-4 py-2 text-sm text-[var(--cf-accent)] hover:bg-[var(--cf-surface-2)] text-left disabled:opacity-50"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors"
                  >
                    Log in
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-2)] hover:text-[var(--cf-text)] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden border-t border-[var(--cf-border)] bg-[var(--cf-surface)]"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              <Link
                href="/"
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/') ? 'text-[var(--cf-primary)] bg-[var(--cf-primary)]/10' : 'text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]'}`}
                onClick={() => setIsOpen(false)}
              >
                <Home className="mr-3 h-5 w-5" />
                Home
              </Link>
              <Link
                href="/campaigns"
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/campaigns') ? 'text-[var(--cf-primary)] bg-[var(--cf-primary)]/10' : 'text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]'}`}
                onClick={() => setIsOpen(false)}
              >
                <Compass className="mr-3 h-5 w-5" />
                Explore
              </Link>
              <Link
                href="/about"
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/about') ? 'text-[var(--cf-primary)] bg-[var(--cf-primary)]/10' : 'text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]'}`}
                onClick={() => setIsOpen(false)}
              >
                <Info className="mr-3 h-5 w-5" />
                About
              </Link>
              <Link
                href="/contact"
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/contact') ? 'text-[var(--cf-primary)] bg-[var(--cf-primary)]/10' : 'text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]'}`}
                onClick={() => setIsOpen(false)}
              >
                <Phone className="mr-3 h-5 w-5" />
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/dashboard') ? 'text-[var(--cf-primary)] bg-[var(--cf-primary)]/10' : 'text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                  {user.role !== 'admin' && (
                    <Link
                      href="/dashboard/purchase-credit"
                      className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/dashboard/purchase-credit') ? 'text-[var(--cf-primary)] bg-[var(--cf-primary)]/10' : 'text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]'}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <CreditCard className="mr-3 h-5 w-5" />
                      Buy Credits
                    </Link>
                  )}
                  
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Coins className="h-5 w-5 text-[var(--cf-secondary)]" />
                    <span className="font-semibold text-[var(--cf-text)]">{user.credits} credits</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-[var(--cf-accent)] hover:bg-[var(--cf-surface-2)]"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="mt-4 flex flex-col gap-2 border-t border-[var(--cf-border)] pt-4">
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                  <Button asChild className="w-full">
                    <Link href="/register" onClick={() => setIsOpen(false)}>Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
