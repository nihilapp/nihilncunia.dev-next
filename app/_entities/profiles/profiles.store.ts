import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { Profile } from './profiles.table';

interface ProfilesActions {
  setCurrentProfile: (profile: Profile | null) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  clearProfile: () => void;
}

interface ProfilesState {
  currentProfile: Profile | null;
  isAuthenticated: boolean;
  actions: ProfilesActions;
}

const createProfilesSlice: StateCreator<
  ProfilesState,
  [['zustand/immer', never]]
> = (set) => ({
  currentProfile: null,
  isAuthenticated: false,

  actions: {
    setCurrentProfile: (profile) =>
      set((state) => {
        state.currentProfile = profile;
        state.isAuthenticated = !!profile;
      }),

    updateProfile: (updates) =>
      set((state) => {
        if (state.currentProfile) {
          Object.assign(state.currentProfile, updates);
        }
      }),

    clearProfile: () =>
      set((state) => {
        state.currentProfile = null;
        state.isAuthenticated = false;
      }),
  },
});

export const useProfilesStore = create<ProfilesState>()(
  immer(createProfilesSlice)
);

export const useProfilesActions = () => useProfilesStore((state) => state.actions);
export const useCurrentProfile = () => useProfilesStore((state) => state.currentProfile);
export const useIsAuthenticated = () => useProfilesStore((state) => state.isAuthenticated);