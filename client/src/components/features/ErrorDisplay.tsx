/**
 * ErrorDisplay Component
 * Display errors in a user-friendly way
 */

import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { Button, Card } from '@/components/ui';
import type { ApiError } from '@/types';

export interface ErrorDisplayProps {
  error: ApiError | string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  className,
}) => {
  const errorMessage = typeof error === 'string' ? error : error.error;
  const errorDetails = typeof error === 'string' ? undefined : error.details;
  const errorCode = typeof error === 'string' ? undefined : error.code;

  return (
    <Card variant="glass" hover className={className}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-danger-100 dark:bg-danger-900/30 rounded-xl">
          <FiAlertCircle className="text-danger-600 dark:text-danger-400 text-3xl" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-danger-700 dark:text-danger-400 mb-2">
            Une erreur est survenue
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {errorMessage}
          </p>

          {errorDetails && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
              {errorDetails}
            </p>
          )}

          {errorCode && (
            <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mb-4">
              Code d'erreur: {errorCode}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="primary"
                size="sm"
                leftIcon={<FiRefreshCw className="w-4 h-4" />}
              >
                Réessayer
              </Button>
            )}
            
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="sm"
            >
              Rafraîchir la page
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
