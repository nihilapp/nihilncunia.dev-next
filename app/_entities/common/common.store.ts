import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CommonActions {
  toggleDarkMode: () => void;
}

interface CommonState {
  isDarkMode: boolean;
  actions: CommonActions;
}

const createCommonSlice: StateCreator<
  CommonState,
  [['zustand/immer', never]]
> = (set) => ({
  isDarkMode: false,
  actions: {
    toggleDarkMode: () => set((state) => {
      state.isDarkMode = !state.isDarkMode;
    }),
  },
});

const useCommonStore = create<CommonState>()(persist(
  immer(createCommonSlice),
  {
    name: 'common-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ isDarkMode: state.isDarkMode, }),
  }
));

export const useIsDarkMode = () => useCommonStore((state) => state.isDarkMode);

export const useCommonActions = () => useCommonStore((state) => state.actions);
