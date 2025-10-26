/**
 * useQuery Hook
 * Manages query execution with loading and error states
 */

import { useState, useCallback } from 'react';
import { executeQuery } from '@/services';
import type { QueryResponse, ApiError } from '@/types';

interface UseQueryResult {
  data: QueryResponse | null;
  isLoading: boolean;
  error: ApiError | null;
  execute: (question: string) => Promise<void>;
  reset: () => void;
}

export function useQuery(): UseQueryResult {
  const [data, setData] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (question: string) => {
    if (!question.trim()) {
      setError({
        error: 'Veuillez entrer une question',
        code: 'EMPTY_QUESTION',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await executeQuery(question);
      setData(response);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}
