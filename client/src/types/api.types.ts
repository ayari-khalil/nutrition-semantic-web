/**
 * API Type Definitions
 * All types related to API requests and responses
 */

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  sparql: string;
  results: QueryResult[];
  count: number;
  executionTime?: number;
}

export interface QueryResult {
  [key: string]: string | number | null | boolean;
}

export interface ApiError {
  error: string;
  details?: string;
  code?: string;
  timestamp?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}
