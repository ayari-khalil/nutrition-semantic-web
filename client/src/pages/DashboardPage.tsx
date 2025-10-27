import React, { useState, useEffect } from 'react';
import { User, Utensils, Activity, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFoods: 0,
    totalRecipes: 0,
    totalActivities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const usersResponse = await axios.post(`${API_BASE_URL}/api/query/sparql`, {
        query: `
          PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(?user) AS ?count) WHERE {
            ?user rdf:type ex:Utilisateur .
          }
        `
      });

      const foodsResponse = await axios.post(`${API_BASE_URL}/api/query/sparql`, {
        query: `
          PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(?food) AS ?count) WHERE {
            ?food rdf:type ex:Aliment .
          }
        `
      });

      const recipesResponse = await axios.post(`${API_BASE_URL}/api/query/sparql`, {
        query: `
          PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(?recipe) AS ?count) WHERE {
            ?recipe rdf:type ex:Recette .
          }
        `
      });

      const activitiesResponse = await axios.post(`${API_BASE_URL}/api/query/sparql`, {
        query: `
          PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(?activity) AS ?count) WHERE {
            ?activity rdf:type ex:ActivitéPhysique .
          }
        `
      });

      setStats({
        totalUsers: parseInt(usersResponse.data.results[0]?.count || 0),
        totalFoods: parseInt(foodsResponse.data.results[0]?.count || 0),
        totalRecipes: parseInt(recipesResponse.data.results[0]?.count || 0),
        totalActivities: parseInt(activitiesResponse.data.results[0]?.count || 0)
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  type StatCardProps = {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    gradient: string;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient }) => (
    <div className={`${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-1 min-w-[240px]`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-4xl font-bold mb-2">
            {loading ? '...' : value}
          </h3>
          <p className="text-white/90 text-sm font-medium">{title}</p>
        </div>
        <div className="bg-white/20 dark:bg-white/10 p-3 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your nutrition system</p>
        </div>

        <div className="flex flex-wrap gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<User className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Foods Available"
            value={stats.totalFoods}
            icon={<Utensils className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-orange-500 to-amber-600"
          />
          <StatCard
            title="Recipes"
            value={stats.totalRecipes}
            icon={<Utensils className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
          <StatCard
            title="Physical Activities"
            value={stats.totalActivities}
            icon={<Activity className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-lime-500 to-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">System Health</h2>
            <div className="space-y-4">
              {['Backend API', 'Fuseki Server', 'Ontology Loaded', 'AI Model'].map((label, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                      Online
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { title: 'Add New User', icon: <User className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600', subtitle: 'Create a new user profile' },
                { title: 'Add Food Item', icon: <Utensils className="w-5 h-5" />, color: 'from-orange-500 to-amber-600', subtitle: 'Register new food in database' },
                { title: 'View Analytics', icon: <TrendingUp className="w-5 h-5" />, color: 'from-cyan-500 to-blue-600', subtitle: 'Check nutrition trends' },
                { title: 'Track Activities', icon: <Activity className="w-5 h-5" />, color: 'from-lime-500 to-green-600', subtitle: 'Log physical activities' }
              ].map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                >
                  <div className={`bg-gradient-to-br ${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{action.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{action.subtitle}</p>
                  </div>
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
