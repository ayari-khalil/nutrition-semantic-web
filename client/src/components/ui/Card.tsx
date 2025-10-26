/**
 * Card Component
 * Flexible container with multiple variants and optional header/footer
 */

import React from 'react';
import { cn } from '@/utils';
import type { CardVariant, BaseComponentProps } from '@/types';

export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg',
  glass: 'glass-effect',
  gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl',
  bordered: 'bg-white dark:bg-slate-800 border-2 border-primary-200 dark:border-primary-800',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  padding = 'md',
  header,
  footer,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
        className
      )}
    >
      {header && (
        <div className={cn('mb-4', padding !== 'none' && '-mt-2')}>
          {typeof header === 'string' ? (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      
      <div>{children}</div>
      
      {footer && (
        <div className={cn('mt-4', padding !== 'none' && '-mb-2')}>
          {footer}
        </div>
      )}
    </div>
  );
};
