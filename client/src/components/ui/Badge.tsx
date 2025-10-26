/**
 * Badge Component
 * Small status indicator with multiple variants
 */

import React from 'react';
import { cn } from '@/utils';
import type { AlertType, BaseComponentProps } from '@/types';

export interface BadgeProps extends BaseComponentProps {
  variant?: AlertType | 'primary' | 'secondary';
  icon?: React.ReactNode;
  dot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800',
  secondary: 'bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 border-secondary-200 dark:border-secondary-800',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  success: 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800',
  warning: 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300 border-warning-200 dark:border-warning-800',
  error: 'bg-danger-100 dark:bg-danger-900 text-danger-700 dark:text-danger-300 border-danger-200 dark:border-danger-800',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  icon,
  dot = false,
  size = 'md',
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-full border font-medium',
        'transition-colors duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            variant === 'primary' && 'bg-primary-500',
            variant === 'secondary' && 'bg-secondary-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'error' && 'bg-danger-500'
          )}
        />
      )}
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
};
