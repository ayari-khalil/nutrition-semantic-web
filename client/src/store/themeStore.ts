/**
 * Theme Store
 * Global state management for theme using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { config } from '@/config';
import type { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: config.theme.defaultMode,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: config.theme.storageKey,
    }
  )
);
