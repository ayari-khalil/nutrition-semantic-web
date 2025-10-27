import { useState, useEffect } from 'react';
import { User, Utensils, Activity, TrendingUp, RefreshCw, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

interface Stats {
  totalUsers: number;
  totalFoods: number;
  totalRecipes: number;
  totalActivities: number;
}

interface UserData {
  name: string;
  age: string;
  weight: string;
  height: string;
}

interface FoodData {
  name: string;
  calories: string;
  proteins: string;
}

interface ActivityData {
  name: string;
  duration: string;
  intensity: string;
}

interface SystemStatus {
  backend: boolean;
  fuseki: boolean;
  ontology: boolean;
  ai: boolean;
}

function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFoods: 0,
    totalRecipes: 0,
    totalActivities: 0
  });
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [topFoods, setTopFoods] = useState<FoodData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityData[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    backend: false,
    fuseki: false,
    ontology: false,
    ai: false
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      setSystemStatus({
        backend: true,
        fuseki: true,
        ontology: true,
        ai: response.data?.ai_status || true
      });
    } catch (err) {
      setSystemStatus({
        backend: false,
        fuseki: false,
        ontology: false,
        ai: false
      });
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadDashboardStats(),
      loadRecentUsers(),
      loadTopFoods(),
      loadRecentActivities(),
      checkSystemHealth()
    ]);
    setLastUpdate(new Date());
    setLoading(false);
  };

  const loadDashboardStats = async () => {
    try {
      const prefix = `PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>`;

      // Use consistent POST requests with JSON body
      const [usersRes, foodsRes, recipesRes, activitiesRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/sparql`, {
          query: `${prefix}\nSELECT (COUNT(?user) AS ?count) WHERE { ?user rdf:type ex:Utilisateur . }`
        }),
        axios.post(`${API_BASE_URL}/sparql`, {
          query: `${prefix}\nSELECT (COUNT(?food) AS ?count) WHERE { ?food rdf:type ex:Aliment . }`
        }),
        axios.post(`${API_BASE_URL}/sparql`, {
          query: `${prefix}\nSELECT (COUNT(?recipe) AS ?count) WHERE { ?recipe rdf:type ex:Recette . }`
        }),
        axios.post(`${API_BASE_URL}/sparql`, {
          query: `${prefix}\nSELECT (COUNT(?activity) AS ?count) WHERE { ?activity rdf:type ex:ActivitéPhysique . }`
        })
      ]);

      setStats({
        totalUsers: parseInt(usersRes.data.results?.bindings[0]?.count?.value || '0'),
        totalFoods: parseInt(foodsRes.data.results?.bindings[0]?.count?.value || '0'),
        totalRecipes: parseInt(recipesRes.data.results?.bindings[0]?.count?.value || '0'),
        totalActivities: parseInt(activitiesRes.data.results?.bindings[0]?.count?.value || '0')
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadRecentUsers = async () => {
    try {
      const query = `PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?user ?nom ?age ?poids ?taille WHERE {
  ?user rdf:type ex:Utilisateur .
  OPTIONAL { ?user ex:aNom ?nom . }
  OPTIONAL { ?user ex:aAge ?age . }
  OPTIONAL { ?user ex:aPoids ?poids . }
  OPTIONAL { ?user ex:aTaille ?taille . }
} LIMIT 5`;

      const response = await axios.post(`${API_BASE_URL}/sparql`, { query });
      const bindings = response.data.results?.bindings || [];
      
      setRecentUsers(bindings.map((b: any) => ({
        name: b.nom?.value || b.user?.value.split('#')[1] || 'Unknown',
        age: b.age?.value || 'N/A',
        weight: b.poids?.value || 'N/A',
        height: b.taille?.value || 'N/A'
      })));
    } catch (err) {
      console.error('Error loading users:', err);
      setRecentUsers([]);
    }
  };

  const loadTopFoods = async () => {
    try {
      const query = `PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?aliment ?calories ?proteines WHERE {
  ?aliment rdf:type ex:Aliment .
  OPTIONAL { ?aliment ex:aCalories ?calories . }
  OPTIONAL { ?aliment ex:aProtéines ?proteines . }
} LIMIT 6`;

      const response = await axios.post(`${API_BASE_URL}/sparql`, { query });
      const bindings = response.data.results?.bindings || [];
      
      setTopFoods(bindings.map((b: any) => ({
        name: b.aliment?.value.split('#')[1] || 'Unknown',
        calories: b.calories?.value || 'N/A',
        proteins: b.proteines?.value || 'N/A'
      })));
    } catch (err) {
      console.error('Error loading foods:', err);
      setTopFoods([]);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const query = `PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?activity ?duree ?intensite WHERE {
  ?activity rdf:type ex:ActivitéPhysique .
  OPTIONAL { ?activity ex:aDurée ?duree . }
  OPTIONAL { ?activity ex:aIntensité ?intensite . }
} LIMIT 4`;

      const response = await axios.post(`${API_BASE_URL}/sparql`, { query });
      const bindings = response.data.results?.bindings || [];
      
      setRecentActivities(bindings.map((b: any) => ({
        name: b.activity?.value.split('#')[1] || 'Unknown',
        duration: b.duree?.value || 'N/A',
        intensity: b.intensite?.value || 'N/A'
      })));
    } catch (err) {
      console.error('Error loading activities:', err);
      setRecentActivities([]);
    }
  };

  type StatCardProps = {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    gradient: string;
    trend?: number;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient, trend }) => (
    <div className={`${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-1 min-w-[240px]`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-4xl font-bold mb-2">
            {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : value}
          </h3>
          <p className="text-white/90 text-sm font-medium">{title}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+{trend}% vs last month</span>
            </div>
          )}
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </div>
          <button
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">System Status</h3>
            <div className="flex gap-4">
              {[
                { label: 'Backend API', status: systemStatus.backend },
                { label: 'Fuseki Server', status: systemStatus.fuseki },
                { label: 'Ontology', status: systemStatus.ontology },
                { label: 'AI Model', status: systemStatus.ai }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.status ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<User className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            trend={12}
          />
          <StatCard
            title="Foods Available"
            value={stats.totalFoods}
            icon={<Utensils className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-orange-500 to-amber-600"
            trend={8}
          />
          <StatCard
            title="Recipes"
            value={stats.totalRecipes}
            icon={<Utensils className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
            trend={15}
          />
          <StatCard
            title="Physical Activities"
            value={stats.totalActivities}
            icon={<Activity className="w-8 h-8" />}
            gradient="bg-gradient-to-br from-lime-500 to-green-600"
            trend={20}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" />
              Recent Users
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{user.age} years</span>
                          <span>•</span>
                          <span>{user.height} cm</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">{user.weight} kg</p>
                      <p className="text-xs text-gray-500">Weight</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No users found</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-orange-600" />
              Available Foods
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {loading ? (
                <div className="col-span-2 flex justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
                </div>
              ) : topFoods.length > 0 ? (
                topFoods.map((food, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-4 h-4 text-orange-600" />
                      <p className="font-semibold text-gray-800 text-sm truncate">{food.name}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Calories</span>
                        <span className="text-sm font-bold text-orange-600">{food.calories}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Proteins</span>
                        <span className="text-sm font-bold text-orange-600">{food.proteins}g</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500 py-8">No foods found</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-lime-600" />
              Physical Activities
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-lime-600" />
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-lime-50 to-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-lime-500 to-green-600 p-3 rounded-lg">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{activity.name}</p>
                        <p className="text-sm text-gray-500">{activity.intensity} intensity</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lime-600">{activity.duration} min</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No activities found</p>
              )}
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