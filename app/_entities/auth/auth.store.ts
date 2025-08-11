import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserWithOmitPassword } from '@/_entities/users';

interface AuthState {
  // 상태
  user: UserWithOmitPassword | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 액션
  setUser: (user: UserWithOmitPassword | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  login: (user: UserWithOmitPassword) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    // 초기 상태
    user: null,
    isAuthenticated: false,
    isLoading: false,

    // 액션
    setUser: (user) => set({ user, }),
    setAuthenticated: (isAuthenticated) => set({ isAuthenticated, }),
    setLoading: (isLoading) => set({ isLoading, }),

    login: (user) => set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

    logout: () => set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

    clearAuth: () => set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
  }),
  {
    name: 'auth-storage',
    // 민감한 정보는 저장하지 않음 (토큰은 쿠키에만 저장)
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }),
  }
));
