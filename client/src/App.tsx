/**
 * Main Application Component
 * Nutrition AI Assistant - Complete TypeScript Version
 */

import { useState, useCallback } from 'react';
import {
  Header,
  Footer,
  Container,
  Card,
  SearchBar,
  ExampleQuestions,
  SPARQLDisplay,
  QueryResults,
  ErrorDisplay,
  LoadingState,
} from '@/components';
import { useQuery } from '@/hooks';
import { useQueryStore } from '@/store';

function App() {
  const { data, isLoading, error, execute, reset } = useQuery();
  const addToHistory = useQueryStore((state) => state.addToHistory);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const handleSearch = useCallback(
    async (question: string) => {
      setCurrentQuestion(question);
      await execute(question);
      
      // Add to history after successful query
      if (!error) {
        addToHistory(question, data?.count);
      }
    },
    [execute, error, data?.count, addToHistory]
  );

  const handleSelectExample = (question: string) => {
    setCurrentQuestion(question);
    reset();
  };

  const handleRetry = () => {
    if (currentQuestion) {
      handleSearch(currentQuestion);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <Container size="xl">
          {/* Search Section */}
          <Card variant="glass" hover className="mb-6 animate-slide-up">
            <SearchBar
              value={currentQuestion}
              onSubmit={handleSearch}
              isLoading={isLoading}
              placeholder="Ex: Quels sont les utilisateurs végétariens?"
            />

            {/* Example Questions */}
            <ExampleQuestions
              onSelectQuestion={handleSelectExample}
              disabled={isLoading}
              className="mt-6"
            />
          </Card>

          {/* Loading State */}
          {isLoading && (
            <LoadingState
              message="Analyse de votre question en cours..."
              size="lg"
              className="my-12"
            />
          )}

          {/* Error Display */}
          {error && !isLoading && (
            <div className="animate-slide-up">
              <ErrorDisplay error={error} onRetry={handleRetry} className="mb-6" />
            </div>
          )}

          {/* Results Section */}
          {data && !isLoading && !error && (
            <div className="space-y-6 animate-fade-in">
              {/* SPARQL Query */}
              <SPARQLDisplay query={data.sparql} />

              {/* Results Table */}
              <QueryResults
                results={data.results}
                count={data.count}
                executionTime={data.executionTime}
              />
            </div>
          )}

          {/* Welcome Message (when no query has been made) */}
          {!data && !isLoading && !error && (
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Bienvenue sur NutritionGO!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Posez vos questions sur la nutrition en langage naturel et obtenez des
                  réponses instantanées grâce à l'intelligence artificielle et au web
                  sémantique.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Traitement en langage naturel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Requêtes SPARQL générées automatiquement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    <span>Résultats en temps réel</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default App;
