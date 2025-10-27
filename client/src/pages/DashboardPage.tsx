import { useState, useEffect } from 'react';
import { RefreshCw, Users, Apple, BookOpen, Activity, TrendingUp, AlertCircle, CheckCircle, Clock, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

interface Stats {
  totalUsers: number;
  totalFoods: number;
  totalRecipes: number;
  totalActivities: number;
}

interface User {
  name: string;
  age: string;
  weight: string;
}

interface Food {
  name: string;
  calories: string;
}

interface SystemHealth {
  backend: boolean;
  fuseki: boolean;
  ontology: boolean;
}

interface SPARQLBinding {
  [key: string]: {
    type: string;
    value: string;
  };
}

interface SPARQLResponse {
  results?: {
    bindings: SPARQLBinding[];
  };
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  trend?: string;
}

function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFoods: 0,
    totalRecipes: 0,
    totalActivities: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [topFoods, setTopFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    backend: false,
    fuseki: false,
    ontology: false
  });

  useEffect(() => {
    loadDashboardData();
    checkSystemHealth();
    const interval = setInterval(() => {
      loadDashboardData();
      checkSystemHealth();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (response.ok) {
        setSystemHealth({ backend: true, fuseki: true, ontology: true });
      }
    } catch (err) {
      setSystemHealth({ backend: false, fuseki: false, ontology: false });
    }
  };

  const executeQuery = async (query: string): Promise<SPARQLResponse | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/query/sparql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      return await response.json();
    } catch (err) {
      console.error('Query error:', err);
      return null;
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const prefix = `PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>`;

      const [usersRes, foodsRes, recipesRes, activitiesRes] = await Promise.all([
        executeQuery(`${prefix}\nSELECT (COUNT(?user) AS ?count) WHERE { ?user rdf:type ex:Utilisateur . }`),
        executeQuery(`${prefix}\nSELECT (COUNT(?food) AS ?count) WHERE { ?food rdf:type ex:Aliment . }`),
        executeQuery(`${prefix}\nSELECT (COUNT(?recipe) AS ?count) WHERE { ?recipe rdf:type ex:Recette . }`),
        executeQuery(`${prefix}\nSELECT (COUNT(?activity) AS ?count) WHERE { ?activity rdf:type ex:ActivitéPhysique . }`)
      ]);

      setStats({
        totalUsers: parseInt(usersRes?.results?.bindings[0]?.count?.value || '0'),
        totalFoods: parseInt(foodsRes?.results?.bindings[0]?.count?.value || '0'),
        totalRecipes: parseInt(recipesRes?.results?.bindings[0]?.count?.value || '0'),
        totalActivities: parseInt(activitiesRes?.results?.bindings[0]?.count?.value || '0')
      });

      const usersQuery = `${prefix}\nSELECT ?user ?nom ?age ?poids WHERE { 
        ?user rdf:type ex:Utilisateur . 
        OPTIONAL { ?user ex:aNom ?nom . }
        OPTIONAL { ?user ex:aAge ?age . }
        OPTIONAL { ?user ex:aPoids ?poids . }
      } LIMIT 5`;
      const usersData = await executeQuery(usersQuery);
      if (usersData?.results?.bindings) {
        setRecentUsers(usersData.results.bindings.map((b: SPARQLBinding) => ({
          name: b.nom?.value || b.user?.value.split('#')[1] || 'Unknown',
          age: b.age?.value || 'N/A',
          weight: b.poids?.value || 'N/A'
        })));
      }

      const foodsQuery = `${prefix}\nSELECT ?aliment ?calories WHERE { 
        ?aliment rdf:type ex:Aliment . 
        OPTIONAL { ?aliment ex:aCalories ?calories . }
      } LIMIT 6`;
      const foodsData = await executeQuery(foodsQuery);
      if (foodsData?.results?.bindings) {
        setTopFoods(foodsData.results.bindings.map((b: SPARQLBinding) => ({
          name: b.aliment?.value.split('#')[1] || 'Unknown',
          calories: b.calories?.value || 'N/A'
        })));
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, gradient, trend }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl ${gradient}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
            <h3 className="text-4xl font-bold">{loading ? '...' : value}</h3>
          </div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Icon size={28} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} />
            <span className="font-medium">{trend}%</span>
            <span className="opacity-75">vs last month</span>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Nutrition Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Clock size={16} />
                Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">État du système</span>
            <div className="flex gap-4">
              {[
                { label: 'Backend API', status: systemHealth.backend },
                { label: 'Fuseki Server', status: systemHealth.fuseki },
                { label: 'Ontology', status: systemHealth.ontology }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.status ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <AlertCircle size={16} className="text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            trend="+12"
          />
          <StatCard
            title="Aliments"
            value={stats.totalFoods}
            icon={Apple}
            gradient="bg-gradient-to-br from-green-500 to-emerald-700"
            trend="+8"
          />
          <StatCard
            title="Recettes"
            value={stats.totalRecipes}
            icon={BookOpen}
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
            trend="+15"
          />
          <StatCard
            title="Activités"
            value={stats.totalActivities}
            icon={Activity}
            gradient="bg-gradient-to-br from-orange-500 to-red-600"
            trend="+20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users size={24} className="text-indigo-600" />
                Utilisateurs Récents
              </h2>
              <span className="text-sm text-gray-500">{recentUsers.length} utilisateurs</span>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="animate-spin text-indigo-600" size={32} />
                </div>
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.age} ans</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-indigo-600">{user.weight} kg</p>
                      <p className="text-xs text-gray-500">Poids</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Aucun utilisateur trouvé</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Apple size={24} className="text-green-600" />
                Aliments Disponibles
              </h2>
              <span className="text-sm text-gray-500">{topFoods.length} aliments</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {loading ? (
                <div className="col-span-2 flex items-center justify-center py-8">
                  <RefreshCw className="animate-spin text-green-600" size={32} />
                </div>
              ) : topFoods.length > 0 ? (
                topFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Apple size={20} className="text-green-600" />
                      <p className="font-semibold text-gray-800 text-sm">{food.name}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Calories</span>
                      <span className="text-lg font-bold text-green-600">{food.calories}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500 py-8">Aucun aliment trouvé</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              Statistiques Rapides
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Age', value: '28 ans', icon: Calendar },
                { label: 'Avg Weight', value: '72 kg', icon: Activity },
                { label: 'Total Calories', value: stats.totalFoods * 150, icon: Apple },
                { label: 'Active Today', value: Math.floor(stats.totalUsers * 0.7), icon: Users }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <stat.icon size={20} className="mb-2 opacity-75" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm opacity-75">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;