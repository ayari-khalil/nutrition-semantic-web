/**
 * Header Component
 * Main application header with logo, title, and theme toggle
 */

import React from 'react';
import { BiLeaf } from 'react-icons/bi';
import { FiCpu, FiDatabase } from 'react-icons/fi';
import { ThemeToggle } from '@/components/ui';
import { Container } from './Container';
import { config } from '@/config';
import { cn } from '@/utils';

export interface HeaderProps {
  className?: string;
  sticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ className, sticky = false }) => {
  return (
    <header
      className={cn(
        'w-full py-8',
        sticky && 'sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800',
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-lg animate-pulse-slow">
                <BiLeaf className="text-white text-4xl" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
                {config.app.name}
              </h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-4">
              Posez vos questions sur la nutrition en langage naturel
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                <FiCpu className="text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                  AI-Powered
                </span>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                <FiDatabase className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Semantic Web
                </span>
              </div>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <div className="ml-4">
            <ThemeToggle showLabel />
          </div>
        </div>
      </Container>
    </header>
  );
};
