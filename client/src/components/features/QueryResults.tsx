/**
 * QueryResults Component
 * Display query results in a beautiful table with sorting
 */

import React, { useState, useMemo } from 'react';
import { FiCheckCircle, FiDownload, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Card, Badge, Button } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { formatNumber, pluralize } from '@/utils';
import type { QueryResult } from '@/types';

export interface QueryResultsProps {
  results: QueryResult[];
  count: number;
  executionTime?: number;
  className?: string;
}

type SortConfig = {
  key: string | null;
  direction: 'asc' | 'desc';
};

export const QueryResults: React.FC<QueryResultsProps> = ({
  results,
  count,
  executionTime,
  className,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Get table headers from first result
  const headers = results.length > 0 ? Object.keys(results[0]) : [];

  // Sorted results
  const sortedResults = useMemo(() => {
    if (!sortConfig.key) return results;

    return [...results].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [results, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleExport = () => {
    // Convert to CSV
    const csv = [
      headers.join(','),
      ...sortedResults.map((row) =>
        headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
      ),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) {
    return (
      <Card variant="glass" hover className={className}>
        <EmptyState
          title="Aucun résultat trouvé"
          message="Essayez de reformuler votre question ou utilisez l'un des exemples ci-dessus."
        />
      </Card>
    );
  }

  return (
    <Card variant="glass" hover className={className}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
            <FiCheckCircle className="text-success-600 dark:text-success-400 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Résultats
            </h3>
            {executionTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Exécuté en {executionTime}ms
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" size="md">
            {formatNumber(count)} {pluralize(count, 'résultat')}
          </Badge>

          {results.length > 0 && (
            <Button
              onClick={handleExport}
              variant="secondary"
              size="sm"
              leftIcon={<FiDownload className="w-4 h-4" />}
            >
              Exporter CSV
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-500 to-secondary-600">
              {headers.map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-primary-600 transition-colors first:rounded-tl-xl last:rounded-tr-xl select-none"
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortConfig.key === header && (
                      sortConfig.direction === 'asc' ? (
                        <FiArrowUp className="w-4 h-4" />
                      ) : (
                        <FiArrowDown className="w-4 h-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {sortedResults.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {row[header] !== null && row[header] !== undefined ? (
                      <span>{String(row[header])}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 italic">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
