import React, { useState, useEffect } from 'react';
import { User, Utensils, Activity, TrendingUp } from 'lucide-react';
import axios from 'axios';

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
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your nutrition system</p>
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
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">System Health</h2>
            <div className="space-y-4">
              {['Backend API', 'Fuseki Server', 'Ontology Loaded', 'AI Model'].map((label, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Online
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { title: 'Add New User', icon: <User className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600', subtitle: 'Create a new user profile' },
                { title: 'Add Food Item', icon: <Utensils className="w-5 h-5" />, color: 'from-orange-500 to-amber-600', subtitle: 'Register new food in database' },
                { title: 'View Analytics', icon: <TrendingUp className="w-5 h-5" />, color: 'from-cyan-500 to-blue-600', subtitle: 'Check nutrition trends' },
                { title: 'Track Activities', icon: <Activity className="w-5 h-5" />, color: 'from-lime-500 to-green-600', subtitle: 'Log physical activities' }
              ].map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className={`bg-gradient-to-br ${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.subtitle}</p>
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