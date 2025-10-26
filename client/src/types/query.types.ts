/**
 * Query Type Definitions
 * All types related to user queries and examples
 */

import { ReactNode } from 'react';
import { IconType } from 'react-icons';

export type QuestionCategory = 'user' | 'nutrition' | 'health' | 'activity' | 'allergy';

export interface ExampleQuestion {
  id: string;
  question: string;
  icon: IconType | ReactNode;
  category: QuestionCategory;
}

export interface QueryHistory {
  id: string;
  question: string;
  timestamp: Date;
  resultsCount?: number;
}

export interface QueryState {
  isLoading: boolean;
  error: string | null;
  currentQuestion: string;
  history: QueryHistory[];
}
