'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import api from '@/lib/api';
import { Campaign } from '@/types/campaign.types';
import { CampaignCard, CampaignCardSkeleton } from '@/components/campaigns/CampaignCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const CATEGORIES = ['All', 'Technology', 'Art', 'Community', 'Health', 'Education', 'Other'];
const SORTS = [
  { value: 'raised', label: 'Most Funded' },
  { value: 'newest', label: 'Newest First' },
  { value: 'deadline', label: 'Ending Soon' },
  { value: 'alpha', label: 'Alphabetical' }
];

interface CampaignsResponse {
  success: boolean;
  data: Campaign[];
  meta: { total: number; page: number; limit: number; pages: number };
}

export function CampaignsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<'active' | 'all'>('active');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setLimit(8); // Desktop (xl): 4 columns -> 2 rows of 4
      } else if (window.innerWidth >= 1024) {
        setLimit(6); // Laptop (lg): 3 columns -> 2 rows of 3
      } else if (window.innerWidth >= 640) {
        setLimit(6); // Tablet (sm): 2 columns -> 3 rows of 2
      } else {
        setLimit(4); // Mobile: 1 column -> 4 rows
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, status, sort]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...queryKeys.campaigns.all({ search: debouncedSearch, category, status, sort }), page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (category !== 'All') params.append('category', category);
      params.append('status', status);
      params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await api.get<CampaignsResponse>(`/campaigns?${params.toString()}`);
      return res.data;
    },
    enabled: isMounted,
  });

  return (
    <div className="py-12 bg-[var(--cf-bg)] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--cf-text)] sm:text-5xl">
            Explore Campaigns
          </h1>
          <p className="mt-4 text-xl text-[var(--cf-text-muted)] max-w-2xl">
            Discover innovative projects from creators around the world and help bring them to life.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-10 space-y-6">
          {/* Top Bar: Search & Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-[var(--cf-surface)] p-4 rounded-2xl border border-[var(--cf-border)] shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--cf-text-muted)]" />
              <Input
                placeholder="Search campaigns by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-[var(--cf-surface-2)] border-none text-base h-12 rounded-xl w-full"
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex bg-[var(--cf-surface-2)] rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setStatus('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === 'active' 
                      ? 'bg-[var(--cf-primary)] text-white shadow-md' 
                      : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === 'all' 
                      ? 'bg-[var(--cf-primary)] text-white shadow-md' 
                      : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                  }`}
                >
                  All Status
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[var(--cf-surface-2)] rounded-xl px-4 h-12 shrink-0">
                <SlidersHorizontal className="h-4 w-4 text-[var(--cf-text-muted)]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-sm font-medium text-[var(--cf-text)] focus:outline-none cursor-pointer border-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[var(--cf-surface)]">{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  category === cat
                    ? 'bg-[var(--cf-primary)] text-white border-[var(--cf-primary)] shadow-lg shadow-[var(--cf-primary)]/30 scale-105'
                    : 'bg-[var(--cf-surface)] text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:border-[var(--cf-primary)]/50 hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-2)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading || !isMounted ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(limit)].map((_, i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-[var(--cf-accent)]/20 bg-[var(--cf-accent)]/10 p-12 text-center">
            <h3 className="text-lg font-semibold text-[var(--cf-accent)] mb-2">Error Loading Campaigns</h3>
            <p className="text-[var(--cf-text-muted)]">Please check your connection and try again.</p>
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.data.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>

            {/* Pagination */}
            {data.meta.pages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="text-sm font-medium text-[var(--cf-text-muted)]">
                  Page <span className="text-[var(--cf-text)]">{page}</span> of <span className="text-[var(--cf-text)]">{data.meta.pages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === data.meta.pages}
                  onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-16 text-center">
            <h3 className="text-xl font-semibold text-[var(--cf-text)] mb-2">No campaigns found</h3>
            <p className="text-[var(--cf-text-muted)]">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => {
              setSearchTerm('');
              setCategory('All');
              setStatus('active');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
