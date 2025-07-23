import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { UserSession } from '@/_entities/auth';

interface AuthActions {
  setSignInStep: (step: number) => void;
  setSignUpStep: (step: number) => void;
  signUserSession: (session: UserSession) => void;
  signOutUserSession: () => void;
  setCardTitle: (title: string) => void;
  setCardDescription: (description: string) => void;
  setCardFooter: (footer: React.ReactNode | null) => void;
}

interface AuthState {
  signInStep: number;
  signUpStep: number;
  session: UserSession | null;
  cardTitle: string;
  cardDescription: string;
  cardFooter: React.ReactNode | null;
  actions: AuthActions;
}

const authStore = create<AuthState>()(
  immer((set) => ({
    signInStep: 0,
    signUpStep: 0,
    session: null,
    cardTitle: '',
    cardDescription: '',
    cardFooter: null,
    actions: {
      setSignInStep: (step) => (
        set((state) => { state.signInStep = step; })
      ),
      setSignUpStep: (step) => (
        set((state) => { state.signUpStep = step; })
      ),
      signUserSession: (session) => (
        set((state) => { state.session = session; })
      ),
      signOutUserSession: () => (
        set((state) => { state.session = null; })
      ),
      setCardTitle: (title) => (
        set((state) => { state.cardTitle = title; })
      ),
      setCardDescription: (description) => (
        set((state) => { state.cardDescription = description; })
      ),
      setCardFooter: (footer) => (
        set((state) => { state.cardFooter = footer; })
      ),
    },
  }))
);

export const useAuthActions = () => authStore(
  (state) => state.actions
);

export const useSignInStep = () => authStore(
  (state) => state.signInStep
);

export const useSignUpStep = () => authStore(
  (state) => state.signUpStep
);

export const useUserSession = () => authStore(
  (state) => state.session
);

export const useCardTitle = () => authStore(
  (state) => state.cardTitle
);

export const useCardDescription = () => authStore(
  (state) => state.cardDescription
);

export const useCardFooter = () => authStore(
  (state) => state.cardFooter
);
