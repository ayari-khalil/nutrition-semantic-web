/**
 * Application Configuration
 * Centralized configuration for the entire application
 */

export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,
  },
  app: {
    name: process.env.REACT_APP_NAME || 'Nutrition AI Assistant',
    version: process.env.REACT_APP_VERSION || '2.0.0',
  },
  features: {
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    pwa: process.env.REACT_APP_ENABLE_PWA === 'true',
  },
  development: {
    debug: process.env.REACT_APP_DEBUG === 'true',
  },
  theme: {
    defaultMode: 'light' as 'light' | 'dark',
    storageKey: 'nutrition-ai-theme',
  },
  query: {
    maxHistoryItems: 10,
    debounceMs: 300,
  },
} as const;

export default config;
