/**
 * Common Type Definitions
 * Shared types used across the application
 */

export type Theme = 'light' | 'dark';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type CardVariant = 'default' | 'glass' | 'gradient' | 'bordered';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}
