/**
 * LoadingState Component
 * Display loading state with spinner and optional message
 */

import React from 'react';
import { Spinner } from '@/components/ui';
import { cn } from '@/utils';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullPage?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Chargement...',
  size = 'lg',
  fullPage = false,
  className,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner size={size} />
      {message && (
        <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      {content}
    </div>
  );
};
