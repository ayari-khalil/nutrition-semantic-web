/**
 * Query Service
 * Handles all query-related API calls
 */

import apiClient from './api';
import type { QueryRequest, QueryResponse } from '@/types';

/**
 * Execute a natural language query
 */
export const executeQuery = async (question: string): Promise<QueryResponse> => {
  const request: QueryRequest = { question };
  
  const response = await apiClient.post<QueryResponse>('/query', request);
  return response.data;
};

/**
 * Query service object with all query-related methods
 */
export const queryService = {
  execute: executeQuery,
};

export default queryService;
