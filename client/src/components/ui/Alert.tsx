/**
 * Alert Component
 * Display important messages with different severity levels
 */

import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiX } from 'react-icons/fi';
import { cn } from '@/utils';
import type { AlertType } from '@/types';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const alertConfig = {
  info: {
    icon: FiInfo,
    styles: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    iconColor: 'text-blue-500',
  },
  success: {
    icon: FiCheckCircle,
    styles: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-800 dark:text-success-300',
    iconColor: 'text-success-500',
  },
  warning: {
    icon: FiAlertTriangle,
    styles: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 text-warning-800 dark:text-warning-300',
    iconColor: 'text-warning-500',
  },
  error: {
    icon: FiAlertCircle,
    styles: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-300',
    iconColor: 'text-danger-500',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border-l-4',
        'animate-slide-up',
        config.styles,
        className
      )}
      role="alert"
    >
      <Icon className={cn('flex-shrink-0 w-5 h-5 mt-0.5', config.iconColor)} />
      
      <div className="flex-1">
        {title && (
          <h4 className="font-bold mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm">
          {message}
        </p>
      </div>
      
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1 rounded-lg',
            'hover:bg-black/5 dark:hover:bg-white/5',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
          )}
          aria-label="Fermer"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
