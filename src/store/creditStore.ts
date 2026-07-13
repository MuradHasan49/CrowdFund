import { create } from 'zustand';
import api from '@/lib/api';

interface CreditState {
  credits: number;
  isLoading: boolean;
  fetchCredits: () => Promise<void>;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
}

export const useCreditStore = create<CreditState>((set) => ({
  credits: 0,
  isLoading: false,
  fetchCredits: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get<{ data: { credits: number } }>('/auth/me');
      if (res.data && res.data.data) {
        set({ credits: res.data.data.credits, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
  addCredits: (amount: number) => set((state) => ({ credits: state.credits + amount })),
  deductCredits: (amount: number) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
}));
