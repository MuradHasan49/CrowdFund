export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  campaigns: {
    all: (params?: Record<string, unknown>) => ['campaigns', params] as const,
    top: ['campaigns', 'top'] as const,
    mine: ['campaigns', 'mine'] as const,
    detail: (id: string) => ['campaigns', id] as const,
  },
  contributions: {
    mine: ['contributions', 'mine'] as const,
    pending: ['contributions', 'pending'] as const,
  },
  withdrawals: {
    mine: ['withdrawals', 'mine'] as const,
    all: ['withdrawals', 'all'] as const,
  },
  credits: {
    history: ['credits', 'history'] as const,
  },
  users: {
    all: (search?: string) => ['users', search] as const,
  },
} as const;
