/**
 * API Client Configuration
 * Axios instance with interceptors and error handling
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@/config';
import type { ApiError } from '@/types';

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add any global request modifications here
 */
apiClient.interceptors.request.use(
  (requestConfig) => {
    // Add timestamp to requests if in debug mode
    if (config.development.debug) {
      console.log(`[API Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
    }
    return requestConfig;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle global response modifications and errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (config.development.debug) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        error: error.response.data?.error || 'Une erreur est survenue',
        details: error.response.data?.details,
        code: error.response.status.toString(),
        timestamp: new Date().toISOString(),
      };
      
      console.error('[API Error]', apiError);
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      const apiError: ApiError = {
        error: 'Impossible de contacter le serveur',
        details: 'Vérifiez votre connexion internet ou que le serveur est démarré',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      };
      
      console.error('[Network Error]', apiError);
      return Promise.reject(apiError);
    } else {
      // Something else happened
      const apiError: ApiError = {
        error: error.message || 'Une erreur inattendue est survenue',
        code: 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      };
      
      console.error('[Unknown Error]', apiError);
      return Promise.reject(apiError);
    }
  }
);

export default apiClient;
