/**
 * SPARQLDisplay Component
 * Display SPARQL query with syntax highlighting and copy functionality
 */

import React, { useState } from 'react';
import { FiDatabase, FiCopy, FiCheck } from 'react-icons/fi';
import { Card, Button } from '@/components/ui';
import { copyToClipboard } from '@/utils';

export interface SPARQLDisplayProps {
  query: string;
  className?: string;
}

export const SPARQLDisplay: React.FC<SPARQLDisplayProps> = ({
  query,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(query);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card variant="glass" hover className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <FiDatabase className="text-purple-600 dark:text-purple-400 text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Requête SPARQL Générée
          </h3>
        </div>
        
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          leftIcon={copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
          className={copied ? 'text-success-600 dark:text-success-400' : ''}
        >
          {copied ? 'Copié !' : 'Copier'}
        </Button>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <pre className="p-6 text-sm leading-relaxed overflow-x-auto">
          <code className="text-green-400 font-mono whitespace-pre">
            {query}
          </code>
        </pre>
      </div>
    </Card>
  );
};
