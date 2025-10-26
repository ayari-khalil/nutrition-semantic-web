/**
 * Query Store
 * Global state management for query history using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, QUERY_LIMITS } from '@/utils';
import type { QueryHistory } from '@/types';

interface QueryState {
  history: QueryHistory[];
  favorites: string[];
  addToHistory: (question: string, resultsCount?: number) => void;
  clearHistory: () => void;
  toggleFavorite: (question: string) => void;
  isFavorite: (question: string) => boolean;
}

export const useQueryStore = create<QueryState>()(
  persist(
    (set, get) => ({
      history: [],
      favorites: [],
      
      addToHistory: (question, resultsCount) =>
        set((state) => {
          // Don't add duplicates
          const exists = state.history.some((h) => h.question === question);
          if (exists) return state;

          const newHistoryItem: QueryHistory = {
            id: Date.now().toString(),
            question,
            timestamp: new Date(),
            resultsCount,
          };

          const updatedHistory = [newHistoryItem, ...state.history].slice(
            0,
            QUERY_LIMITS.maxHistoryItems
          );

          return { history: updatedHistory };
        }),

      clearHistory: () => set({ history: [] }),

      toggleFavorite: (question) =>
        set((state) => {
          const isFav = state.favorites.includes(question);
          const updatedFavorites = isFav
            ? state.favorites.filter((fav) => fav !== question)
            : [...state.favorites, question];

          return { favorites: updatedFavorites };
        }),

      isFavorite: (question) => get().favorites.includes(question),
    }),
    {
      name: STORAGE_KEYS.queryHistory,
    }
  )
);
