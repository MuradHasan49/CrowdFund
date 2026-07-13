import { create } from 'zustand';

export type UserRole = 'supporter' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  isActive: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setInitializing: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) => set({ user, isAuthenticated: true, isInitializing: false }),
  clearUser: () => set({ user: null, isAuthenticated: false, isInitializing: false }),
  setInitializing: (status) => set({ isInitializing: status }),
}));
