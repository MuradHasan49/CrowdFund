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

const CATEGORIES = ['All', 'Technology', 'Health & Wellness', 'Art & Design', 'Environment', 'Software', 'Games', 'Film & Video', 'Music'];
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
  const [sort, setSort] = useState('raised');
  const [page, setPage] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, status, sort]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...queryKeys.campaigns.all({ search: debouncedSearch, category, status, sort }), page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (category !== 'All') params.append('category', category);
      params.append('status', status);
      params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', '12');

      const res = await api.get<CampaignsResponse>(`/campaigns?${params.toString()}`);
      return res.data;
    },
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
        <div className="mb-10 space-y-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--cf-text-muted)]" />
              <Input
                placeholder="Search campaigns by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={status === 'active' ? 'primary' : 'outline'}
                onClick={() => setStatus('active')}
                className="flex-1 md:flex-none"
              >
                Active
              </Button>
              <Button
                variant={status === 'all' ? 'primary' : 'outline'}
                onClick={() => setStatus('all')}
                className="flex-1 md:flex-none"
              >
                All Status
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-[var(--cf-border)]">
            <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      category === cat
                        ? 'bg-[var(--cf-primary)] text-white border-[var(--cf-primary)] shadow-md shadow-[var(--cf-primary)]/20'
                        : 'bg-transparent text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:border-[var(--cf-primary)]/50 hover:text-[var(--cf-text)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <SlidersHorizontal className="h-4 w-4 text-[var(--cf-text-muted)]" />
              <span className="text-sm text-[var(--cf-text-muted)]">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface-2)] px-3 py-2 text-sm text-[var(--cf-text)] focus:border-[var(--cf-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-primary)]"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
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
