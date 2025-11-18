import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id?: number;
  username: string;
  totpBound?: boolean;
  lastLoginAt?: string;
}

interface TokenState {
  token: string | null;
  expiresAt: number | null;
  user: UserProfile | null;
  setToken: (token: string, expiresIn: number) => void;
  clearToken: () => void;
  setUser: (user: UserProfile | null) => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      expiresAt: null,
      user: null,
      setToken: (token, expiresIn) =>
        set({ token, expiresAt: Date.now() + expiresIn * 1000 }),
      clearToken: () => set({ token: null, expiresAt: null, user: null }),
      setUser: (user) => set({ user })
    }),
    { name: 'cc-admin-token' }
  )
);
