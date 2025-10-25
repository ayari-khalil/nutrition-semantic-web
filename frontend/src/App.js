import React, { useState } from 'react';
import axios from 'axios';
import { 
  FiSearch, FiCpu, FiDatabase, FiCheckCircle, FiAlertCircle,
  FiUser, FiActivity, FiHeart, FiTrendingUp, FiZap
} from 'react-icons/fi';
import { BiLeaf } from 'react-icons/bi';

function App() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000';

  const exampleQuestions = [
    { q: "Quels sont tous les utilisateurs?", icon: <FiUser /> },
    { q: "Quelles sont les allergies de Khalil?", icon: <FiAlertCircle /> },
    { q: "Quel est le poids de Dhia?", icon: <FiActivity /> },
    { q: "Quels aliments contiennent des protéines?", icon: <BiLeaf /> },
    { q: "Quels utilisateurs ont un objectif de perte de poids?", icon: <FiTrendingUp /> },
    { q: "Quelles activités physiques pratique moetaz?", icon: <FiHeart /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Veuillez entrer une question');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await axios.post(`${API_URL}/query`, {
        question: question
      });
      setResponse(result.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyExample = (exampleQ) => {
    setQuestion(exampleQ);
    setError(null);
    setResponse(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-lg">
              <BiLeaf className="text-white text-4xl" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nutrition AI Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Posez vos questions sur la nutrition en langage naturel
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <FiCpu className="text-green-600" />
              <span className="text-sm text-green-700 font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <FiDatabase className="text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Semantic Web</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Search Card */}
        <div className="glass-effect rounded-3xl p-8 mb-6 card-hover animate-slide-up">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Quels sont les utilisateurs végétariens?"
                disabled={loading}
                className="w-full px-6 py-4 pr-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <FiZap className="animate-spin text-xl" />
                ) : (
                  <FiSearch className="text-xl" />
                )}
              </button>
            </div>
          </form>

          {/* Example Questions */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <FiZap className="text-yellow-500" />
              Questions d'exemple
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {exampleQuestions.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => applyExample(ex.q)}
                  disabled={loading}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-left disabled:opacity-50 group"
                >
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {React.cloneElement(ex.icon, { className: "text-blue-600" })}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors flex-1">
                    {ex.q}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-effect rounded-2xl p-6 mb-6 border-l-4 border-red-500 animate-slide-up">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-red-500 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-700 mb-1">Erreur</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {response && (
          <div className="space-y-6 animate-fade-in">
            {/* SPARQL Query Card */}
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiDatabase className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Requête SPARQL Générée</h3>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm leading-relaxed">
                  {response.sparql}
                </pre>
              </div>
            </div>

            {/* Results Card */}
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Résultats ({response.count})
                  </h3>
                </div>
                {response.count > 0 && (
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                    {response.count} résultat{response.count > 1 ? 's' : ''} trouvé{response.count > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {response.results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                    <FiAlertCircle className="text-gray-400 text-5xl" />
                  </div>
                  <p className="text-gray-500 text-lg">Aucun résultat trouvé</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-purple-600">
                        {Object.keys(response.results[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider first:rounded-tl-xl last:rounded-tr-xl"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {response.results.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          {Object.values(row).map((val, vidx) => (
                            <td
                              key={vidx}
                              className="px-6 py-4 text-gray-700"
                            >
                              <span className="inline-flex items-center gap-2">
                                {val || (
                                  <span className="text-gray-400 italic">-</span>
                                )}
                              </span>
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

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
            <FiHeart className="text-red-500 animate-pulse-slow" />
            <span className="text-sm text-gray-600">
              Powered by <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI & Semantic Web</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;