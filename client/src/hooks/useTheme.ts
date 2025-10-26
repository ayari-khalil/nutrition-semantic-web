/**
 * useTheme Hook
 * Manages theme state (light/dark mode) with localStorage persistence
 */

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { config } from '@/config';
import type { Theme } from '@/types';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(
    config.theme.storageKey,
    config.theme.defaultMode
  );

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#0f172a' : '#ffffff'
      );
    }
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Set specific theme
  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Check if dark mode is active
  const isDark = theme === 'dark';

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme: setSpecificTheme,
  };
}
