/**
 * Application Constants
 * Centralized constants used throughout the application
 */

import {
  FiUser,
  FiAlertCircle,
  FiActivity,
  FiHeart,
  FiTrendingUp,
} from 'react-icons/fi';
import { BiLeaf } from 'react-icons/bi';
import type { ExampleQuestion } from '@/types';

/**
 * Example questions for the search interface
 */
export const EXAMPLE_QUESTIONS: ExampleQuestion[] = [
  {
    id: 'q1',
    question: 'Quels sont tous les utilisateurs?',
    icon: FiUser,
    category: 'user',
  },
  {
    id: 'q2',
    question: 'Quelles sont les allergies de Khalil?',
    icon: FiAlertCircle,
    category: 'allergy',
  },
  {
    id: 'q3',
    question: 'Quel est le poids de Dhia?',
    icon: FiActivity,
    category: 'health',
  },
  {
    id: 'q4',
    question: 'Quels aliments contiennent des protéines?',
    icon: BiLeaf,
    category: 'nutrition',
  },
  {
    id: 'q5',
    question: 'Quels utilisateurs ont un objectif de perte de poids?',
    icon: FiTrendingUp,
    category: 'health',
  },
  {
    id: 'q6',
    question: 'Quelles activités physiques pratique moetaz?',
    icon: FiHeart,
    category: 'activity',
  },
];

/**
 * Animation duration constants (in milliseconds)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Toast notification duration (in milliseconds)
 */
export const TOAST_DURATION = {
  short: 2000,
  normal: 3000,
  long: 5000,
} as const;

/**
 * Breakpoint values for responsive design
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  theme: 'nutrition-ai-theme',
  queryHistory: 'nutrition-ai-query-history',
  favorites: 'nutrition-ai-favorites',
} as const;

/**
 * Query limits
 */
export const QUERY_LIMITS = {
  maxHistoryItems: 10,
  maxQuestionLength: 500,
  debounceMs: 300,
} as const;
