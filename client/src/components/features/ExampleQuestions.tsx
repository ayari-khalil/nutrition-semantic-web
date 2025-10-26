/**
 * ExampleQuestions Component
 * Grid of example questions users can click
 */

import React from 'react';
import { FiZap } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { EXAMPLE_QUESTIONS } from '@/utils';
import { cn } from '@/utils';
import type { ExampleQuestion } from '@/types';

export interface ExampleQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({
  onSelectQuestion,
  disabled = false,
  className,
}) => {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
        <FiZap className="text-yellow-500" />
        Questions d'exemple
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXAMPLE_QUESTIONS.map((example: ExampleQuestion) => {
          const Icon = example.icon as IconType;
          
          return (
            <button
              key={example.id}
              onClick={() => onSelectQuestion(example.question)}
              disabled={disabled}
              className={cn(
                'flex items-center gap-3 p-4 text-left',
                'bg-white dark:bg-slate-800',
                'border-2 border-gray-200 dark:border-slate-700',
                'rounded-xl',
                'transition-all duration-200',
                'hover:border-primary-400 dark:hover:border-primary-600',
                'hover:shadow-lg hover:-translate-y-0.5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                'group'
              )}
            >
              <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1 line-clamp-2">
                {example.question}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
