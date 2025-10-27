import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Utensils,
  Clock,
  Flame,
  Heart,
  X,
  TrendingUp,
  User
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';
const SPOONACULAR_API_KEY = '998851e456d54e60bf1907163af22cdc';

interface User {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  goal?: string;
  allergies?: string[];
  preferences?: string[];
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  summary?: string;
  healthScore?: number;
  diets?: string[];
}

function RecipePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userData, setUserData] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/query`, {
        question: "Quels sont tous les utilisateurs?"
      });
      if (response.data.results) {
        const userNames = response.data.results.map((r: any) => r.user);
        setUsers(userNames.map((name: string) => ({ name } as User)));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    }
  };

  const loadUserDetails = async (userName: string) => {
    setLoading(true);
    setError('');
    try {
      const [weightRes, ageRes, heightRes, goalRes, allergiesRes, preferencesRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/query`, { question: `Quel est le poids de ${userName}?` }),
        axios.post(`${API_BASE_URL}/query`, { question: `Quel est l'âge de ${userName}?` }),
        axios.post(`${API_BASE_URL}/query`, { question: `Quelle est la taille de ${userName}?` }),
        axios.post(`${API_BASE_URL}/query`, { question: `Quel est l'objectif de ${userName}?` }),
        axios.post(`${API_BASE_URL}/query`, { question: `Quelles sont les allergies de ${userName}?` }),
        axios.post(`${API_BASE_URL}/query`, { question: `Quelles sont les préférences de ${userName}?` })
      ]);

      const user: User = {
        name: userName,
        weight: parseFloat(weightRes.data.results[0]?.poids || 0),
        age: parseInt(ageRes.data.results[0]?.age || 0),
        height: parseFloat(heightRes.data.results[0]?.taille || 0),
        gender: 'male',
        goal: goalRes.data.results[0]?.objectif || 'maintenance',
        allergies: allergiesRes.data.results.map((r: any) => r.allergie) || [],
        preferences: preferencesRes.data.results.map((r: any) => r.preference) || []
      };

      setUserData(user);
      await fetchRecipes(user);
    } catch (err) {
      console.error(err);
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weight: number, height: number) => (weight / (height * height)).toFixed(1);

  const calculateCalorieNeeds = (user: User) => {
    const bmr = user.gender === 'male'
      ? 10 * user.weight + 6.25 * (user.height * 100) - 5 * user.age + 5
      : 10 * user.weight + 6.25 * (user.height * 100) - 5 * user.age - 161;
    const tdee = bmr * 1.55;
    if (user.goal?.toLowerCase().includes('perte')) return Math.round(tdee - 500);
    if (user.goal?.toLowerCase().includes('masse')) return Math.round(tdee + 300);
    return Math.round(tdee);
  };

  const fetchRecipes = async (user: User) => {
    setLoading(true);

    try {
      const targetCalories = calculateCalorieNeeds(user);
      const caloriesPerMeal = Math.round(targetCalories / 3);

      const params: any = {
        apiKey: SPOONACULAR_API_KEY,
        number: 12,
        addRecipeNutrition: true,
        maxCalories: caloriesPerMeal + 200,
        minCalories: caloriesPerMeal - 200
      };

      if (user.preferences?.some(p => typeof p === 'string' && p.toLowerCase().includes('végétarien'))) {
        params.diet = 'vegetarian';
      }
      if (user.preferences?.some(p => typeof p === 'string' && p.toLowerCase().includes('végan'))) {
        params.diet = 'vegan';
      }

      if (user.allergies && user.allergies.length > 0) {
        const validAllergies = user.allergies.filter(a => typeof a === 'string');
        if (validAllergies.length > 0) {
          params.intolerances = validAllergies.join(',').toLowerCase();
        }
      }

      const response = await axios.get(
        'https://api.spoonacular.com/recipes/complexSearch',
        { params }
      );

      const recipesData = response.data.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount,
        protein: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount,
        carbs: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount,
        fat: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount,
        healthScore: recipe.healthScore,
        diets: recipe.diets || []
      }));

      setRecipes(recipesData);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes. Check your Spoonacular API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (userName: string) => {
    setSelectedUser(userName);
    if (userName) loadUserDetails(userName);
    else { setUserData(null); setRecipes([]); }
  };

  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev => prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
  };

  const openRecipeDetails = async (recipe: Recipe) => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, { params: { apiKey: SPOONACULAR_API_KEY } });
      setSelectedRecipe({ ...recipe, summary: response.data.summary });
    } catch {
      setSelectedRecipe(recipe);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Utensils className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Personalized Recipe Recommendations</h1>
              <p className="text-emerald-50">AI-powered meal suggestions based on your health goals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => handleUserChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-800"
          >
            <option value="">Choose a user...</option>
            {users.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {userData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{userData.name}</h3>
              <p className="text-emerald-50">{userData.age} years</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-emerald-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-600">BMI</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{calculateBMI(userData.weight, userData.height)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-orange-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-gray-600">Daily Calories</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{calculateCalorieNeeds(userData)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-blue-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-600">Goal</span>
              </div>
              <p className="text-lg font-bold text-gray-800 mb-2">{userData.goal}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {userData.preferences?.slice(0, 2).map((p, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recommended Recipes ({recipes.length})</h2>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Personalized for you
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
                  <div className="relative">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.includes(recipe.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                    {recipe.healthScore && (
                      <span className="absolute bottom-3 left-3 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                        Health: {recipe.healthScore}/100
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 min-h-[3rem]">
                      {recipe.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.diets?.slice(0, 2).map((d, i) => (
                        <span key={i} className="px-2 py-1 border border-emerald-300 text-emerald-700 rounded-lg text-xs">
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.readyInMinutes} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          <span>{Math.round(recipe.calories || 0)} cal</span>
                        </div>
                      </div>
                      <button
                        onClick={() => openRecipeDetails(recipe)}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        View Recipe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && recipes.length === 0 && selectedUser && (
          <div className="bg-white rounded-2xl p-16 text-center shadow-lg">
            <Utensils className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Recipes Found</h3>
            <p className="text-gray-600">Try selecting a different user or check your API configuration</p>
          </div>
        )}

        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-800 pr-8">{selectedRecipe.title}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-72 object-cover rounded-2xl mb-6"
                />
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {['Calories', 'Protein', 'Carbs', 'Fat'].map((nutrient, i) => (
                    <div key={i} className="bg-emerald-50 rounded-xl p-4 text-center border-2 border-emerald-200">
                      <p className="text-2xl font-bold text-emerald-700">
                        {Math.round((selectedRecipe as any)[nutrient.toLowerCase()] || 0)}
                        {nutrient === 'Calories' ? '' : 'g'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{nutrient}</p>
                    </div>
                  ))}
                </div>
                {selectedRecipe.summary && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}
                    />
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-gray-50 p-6 flex gap-3 rounded-b-3xl border-t border-gray-200">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => toggleFavorite(selectedRecipe.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Heart className={favorites.includes(selectedRecipe.id) ? 'fill-white' : ''} />
                  {favorites.includes(selectedRecipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipePage;
