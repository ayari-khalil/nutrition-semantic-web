import React, { useState } from 'react';
import axios from 'axios';
import { Search, Code, CheckCircle, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:5000';

interface QueryResponse {
  success: boolean;
  question: string;
  sparql: string;
  results: any[];
  count: number;
  error?: string;
}

function QueryPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string>('');

  const exampleQuestions = [
    "Quels sont tous les utilisateurs?",
    "Quelles sont les allergies de Khalil?",
    "Quel est le poids de Dhia?",
    "Quels aliments contiennent des protéines?",
    "Quels utilisateurs ont un objectif de perte de poids?",
    "Quelles activités physiques pratique moetaz?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Veuillez entrer une question');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const result = await axios.post(`${API_URL}/query`, { question });
      setResponse(result.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleQ: string) => {
    setQuestion(exampleQ);
    setError('');
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Search className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">AI Nutrition Query System</h1>
              <p className="text-emerald-50">Ask questions in natural language about nutrition and health</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Quels sont les utilisateurs végétariens?"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[150px] justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Example Questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {exampleQuestions.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(ex)}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {response && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Generated SPARQL Query</h2>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-auto font-mono text-sm">
                <pre className="m-0">{response.sparql}</pre>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-800">Results ({response.count})</h2>
                </div>
                {response.count > 0 && (
                  <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {response.count} result{response.count > 1 ? 's' : ''} found
                  </span>
                )}
              </div>

              {response.results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No results found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-emerald-50 border-b-2 border-emerald-200">
                        {Object.keys(response.results[0]).map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-sm font-bold text-emerald-900 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {response.results.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          {Object.values(row).map((val: any, vidx) => (
                            <td key={vidx} className="px-6 py-4 text-gray-800">
                              {val || <span className="text-gray-400">-</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueryPage;
