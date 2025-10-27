/**
 * Footer Component
 * Application footer with credits and version info
 */

import React from 'react';
import { FiHeart, FiGithub } from 'react-icons/fi';
import { Container } from './Container';
import { config } from '@/config';
import { cn } from '@/utils';

export interface FooterProps {
  className?: string;
  showVersion?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  showVersion = true,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('w-full py-8 mt-12', className)}>
      <Container>
        <div className="text-center space-y-4">
          {/* Main Message */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-white/30 dark:border-slate-700/30 shadow-lg">
            <FiHeart className="text-red-500 animate-pulse-slow" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Powered by{' '}
              <span className="font-bold gradient-text">
                FullStack Attack
              </span>
            </span>
          </div>

          {/* Links and Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>© {currentYear} NutritionGO</span>
            
            {showVersion && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                  v{config.app.version}
                </span>
              </>
            )}
            
            <span className="hidden sm:inline">•</span>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Tech Stack */}
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Built with React, TypeScript, Tailwind CSS & ❤️
          </div>
        </div>
      </Container>
    </footer>
  );
};
