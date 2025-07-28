import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { UserSession } from '@/_entities/auth';

interface AuthActions {
  setSignInStep: (step: number) => void;
  setSignUpStep: (step: number) => void;
  setGuardStep: (step: number) => void;
  signUserSession: (session: UserSession) => void;
  signOutUserSession: () => void;
  setCardTitle: (title: string) => void;
  setCardDescription: (description: string) => void;
  setCardFooter: (footer: React.ReactNode | null) => void;
  setCallbackUrl: (url: string) => void;
}

interface AuthState {
  signInStep: number;
  signUpStep: number;
  guardStep: number;
  session: UserSession | null;
  cardTitle: string;
  cardDescription: string;
  cardFooter: React.ReactNode | null;
  callbackUrl: string;
  actions: AuthActions;
}

const authStore = create<AuthState>()(
  immer((set) => ({
    signInStep: 1,
    signUpStep: 1,
    guardStep: 1,
    session: null,
    cardTitle: '',
    cardDescription: '',
    cardFooter: null,
    callbackUrl: '',
    actions: {
      setSignInStep: (step) => (
        set((state) => { state.signInStep = step; })
      ),
      setSignUpStep: (step) => (
        set((state) => { state.signUpStep = step; })
      ),
      setGuardStep: (step) => (
        set((state) => { state.guardStep = step; })
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
      setCallbackUrl: (url) => (
        set((state) => { state.callbackUrl = url; })
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

export const useGuardStep = () => authStore(
  (state) => state.guardStep
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

export const useCallbackUrl = () => authStore(
  (state) => state.callbackUrl
);
