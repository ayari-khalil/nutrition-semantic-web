/**
 * EmptyState Component
 * Display when there's no data to show
 */

import React from 'react';
import { FiInbox } from 'react-icons/fi';
import { cn } from '@/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Aucun résultat',
  message,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="inline-flex p-6 bg-gray-100 dark:bg-slate-800 rounded-full mb-4">
        {icon || <FiInbox className="text-gray-400 dark:text-gray-500 text-5xl" />}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        {message}
      </p>
      
      {action && <div>{action}</div>}
    </div>
  );
};
