/**
 * SearchBar Component
 * Main search interface for natural language queries
 */

import React, { useState, FormEvent } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { Button, Input } from '@/components/ui';
import { QUERY_LIMITS } from '@/utils';
import { cn } from '@/utils';

export interface SearchBarProps {
  onSubmit: (question: string) => void;
  value?: string;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSubmit,
  value: externalValue = '',
  isLoading = false,
  placeholder = 'Ex: Quels sont les utilisateurs végétariens?',
  className,
}) => {
  const [question, setQuestion] = useState(externalValue);
  const [error, setError] = useState('');

  // Sync with external value
  React.useEffect(() => {
    setQuestion(externalValue);
  }, [externalValue]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Veuillez entrer une question');
      return;
    }

    if (question.length > QUERY_LIMITS.maxQuestionLength) {
      setError(`La question ne doit pas dépasser ${QUERY_LIMITS.maxQuestionLength} caractères`);
      return;
    }

    setError('');
    onSubmit(question.trim());
  };

  const handleClear = () => {
    setQuestion('');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="relative">
        <Input
          type="text"
          value={question}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          error={error}
          fullWidth
          className="pr-24 text-lg"
          rightIcon={
            question && !isLoading ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Effacer"
              >
                <FiX className="w-5 h-5" />
              </button>
            ) : undefined
          }
        />
        
        <div className="absolute right-2 top-[7px]">
          <Button
            type="submit"
            disabled={isLoading || !question.trim()}
            isLoading={isLoading}
            variant="primary"
            size="md"
            className="shadow-lg"
            leftIcon={!isLoading && <FiSearch className="w-5 h-5" />}
          >
            {!isLoading && 'Rechercher'}
          </Button>
        </div>
      </div>

      {/* Character counter */}
      {question && (
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Appuyez sur Entrée pour rechercher
          </span>
          <span
            className={cn(
              'text-xs font-mono',
              question.length > QUERY_LIMITS.maxQuestionLength
                ? 'text-danger-600 dark:text-danger-400'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {question.length} / {QUERY_LIMITS.maxQuestionLength}
          </span>
        </div>
      )}
    </form>
  );
};
