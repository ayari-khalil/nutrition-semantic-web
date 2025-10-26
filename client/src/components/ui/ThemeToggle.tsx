/**
 * ThemeToggle Component
 * Toggle button to switch between light and dark modes
 */

import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/hooks';
import { cn } from '@/utils';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center gap-2',
        'p-2 rounded-xl',
        'bg-gray-100 dark:bg-slate-800',
        'hover:bg-gray-200 dark:hover:bg-slate-700',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className
      )}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <FiSun
          className={cn(
            'absolute inset-0 w-5 h-5 text-yellow-500',
            'transition-all duration-300',
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          )}
        />
        
        {/* Moon Icon */}
        <FiMoon
          className={cn(
            'absolute inset-0 w-5 h-5 text-blue-400',
            'transition-all duration-300',
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          )}
        />
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDark ? 'Clair' : 'Sombre'}
        </span>
      )}
    </button>
  );
};

/**
 * ThemeToggleSwitch Component
 * Alternative switch-style theme toggle
 */
export const ThemeToggleSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center',
        'w-14 h-7 rounded-full',
        'transition-colors duration-300',
        isDark ? 'bg-primary-600' : 'bg-gray-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className
      )}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center',
          'w-6 h-6 rounded-full',
          'bg-white shadow-lg',
          'transition-transform duration-300',
          'transform',
          isDark ? 'translate-x-7' : 'translate-x-1'
        )}
      >
        {isDark ? (
          <FiMoon className="w-3 h-3 text-primary-600" />
        ) : (
          <FiSun className="w-3 h-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
};
