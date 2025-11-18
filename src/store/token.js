import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTokenStore = create()(persist((set) => ({
    token: null,
    expiresAt: null,
    user: null,
    setToken: (token, expiresIn) => set({ token, expiresAt: Date.now() + expiresIn * 1000 }),
    clearToken: () => set({ token: null, expiresAt: null, user: null }),
    setUser: (user) => set({ user })
}), { name: 'cc-admin-token' }));
