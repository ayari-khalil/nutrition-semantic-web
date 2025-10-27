import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Zap,
  Flame,
  Beef,
  Apple,
  ChevronRight,
  RefreshCw,
  Database,
  X,
  AlertCircle
} from 'lucide-react';

// USDA FoodData Central API
const USDA_API_KEY = process.env.REACT_APP_USDA_API_KEY || 'ibqbt1hIC8P7GCoIhVpUfyrWWxCa1CNKJ23LdQc1';

interface FoodItem {
  fdcId: number;
  description: string;
  brandOwner?: string;
  dataType: string;
  foodNutrients: Array<{
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

interface NutrientInfo {
  name: string;
  value: number;
  unit: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
}
export default function USDAFoodWidget() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [featuredFood, setFeaturedFood] = useState<FoodItem | null>(null);
  const [error, setError] = useState<string>('');

  const featuredFoods = [
    'Salmon', 'Avocado', 'Blueberries', 'Spinach', 'Almonds', 
    'Sweet Potato', 'Quinoa', 'Greek Yogurt', 'Broccoli', 'Chicken Breast'
  ];

  useEffect(() => {
    loadRandomFeaturedFood();
  }, []);

  const loadRandomFeaturedFood = async () => {
    const randomFood = featuredFoods[Math.floor(Math.random() * featuredFoods.length)];
    try {
      const response = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search`,
        {
          params: {
            api_key: USDA_API_KEY,
            query: randomFood,
            dataType: 'Foundation,SR Legacy',
            pageSize: 1
          }
        }
      );

      if (response.data.foods && response.data.foods.length > 0) {
        setFeaturedFood(response.data.foods[0]);
      }
    } catch (error) {
      console.error('Error loading featured food:', error);
      setError('Failed to load featured food');
    }
  };

  const searchFoods = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);
    setError('');

    try {
      const response = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search`,
        {
          params: {
            api_key: USDA_API_KEY,
            query: query,
            dataType: 'Foundation,SR Legacy',
            pageSize: 10
          }
        }
      );

      setSearchResults(response.data.foods || []);
      
      if (response.data.foods?.length === 0) {
        setError('No foods found. Try a different search term.');
      }
    } catch (error: any) {
      console.error('Error searching foods:', error);
      if (error.response?.status === 403) {
        setError('API key issue. Please check your configuration.');
      } else if (error.response?.status === 429) {
        setError('Rate limit reached. Please try again in a moment.');
      } else {
        setError('Failed to search foods. Please try again.');
      }
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchFoods(searchQuery);
  };

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setShowResults(false);
    setSearchQuery('');
    setError('');
  };

  const getNutrientValue = (food: FoodItem, nutrientNames: string[]): number => {
    const nutrient = food.foodNutrients.find(n => 
      nutrientNames.some(name => n.nutrientName.toLowerCase().includes(name.toLowerCase()))
    );
    return nutrient ? Math.round(nutrient.value) : 0;
  };

  const getMainNutrients = (food: FoodItem): NutrientInfo[] => {
    return [
      {
        name: 'Calories',
        value: getNutrientValue(food, ['Energy']),
        unit: 'kcal',
        icon: <Flame className="w-5 h-5" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      {
        name: 'Protein',
        value: getNutrientValue(food, ['Protein']),
        unit: 'g',
        icon: <Beef className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        name: 'Carbs',
        value: getNutrientValue(food, ['Carbohydrate']),
        unit: 'g',
        icon: <Apple className="w-5 h-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        name: 'Fat',
        value: getNutrientValue(food, ['Total lipid']),
        unit: 'g',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      }
    ];
  };

  const displayFood = selectedFood || featuredFood;

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 shadow-2xl overflow-visible relative">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3 border border-white/30">
                <Database className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">USDA Database</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                🍎 Food Nutrition Explorer
              </h2>
              <p className="text-emerald-50 text-sm">
                Search 300,000+ foods • 100% Free • Government Data
              </p>
            </div>
            <button
              onClick={() => {
                loadRandomFeaturedFood();
                setSelectedFood(null);
                setError('');
              }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all border border-white/30 group"
              title="Load random food"
            >
              <RefreshCw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any food... (e.g., salmon, avocado, quinoa)"
                  className="w-full pl-12 pr-24 py-4 rounded-2xl border-2 border-white/30 bg-white/95 backdrop-blur-sm focus:bg-white focus:border-white focus:ring-4 focus:ring-white/20 outline-none transition-all text-gray-800 placeholder-gray-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 md:px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute left-0 right-0 top-full mt-3 bg-white rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto z-50 border-4 border-white">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3 sticky top-0 bg-white pb-2 border-b-2 border-gray-100">
                    <h3 className="font-bold text-gray-800">
                      {loading ? 'Searching...' : `Search Results (${searchResults.length})`}
                    </h3>
                    <button
                      onClick={() => {
                        setShowResults(false);
                        setError('');
                      }}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                      <p className="text-sm text-gray-500">Searching USDA database...</p>
                    </div>
                  ) : error ? (
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-800">Search Error</p>
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((food) => (
                        <button
                          key={food.fdcId}
                          onClick={() => selectFood(food)}
                          className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-200"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1 pr-2">
                              <p className="font-semibold text-gray-800 group-hover:text-emerald-700 line-clamp-2">
                                {food.description}
                              </p>
                              {food.brandOwner && (
                                <p className="text-xs text-gray-500 mt-1">{food.brandOwner}</p>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">
                      No results found. Try another search!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Featured/Selected Food Display */}
          {displayFood && !showResults && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-white/50 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-700">
                      {selectedFood ? 'Selected Food' : 'Featured Today'}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                    {displayFood.description}
                  </h3>
                  {displayFood.brandOwner && (
                    <p className="text-sm text-gray-600">{displayFood.brandOwner}</p>
                  )}
                </div>
                {selectedFood && (
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                    title="Close"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Macro Nutrients */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {getMainNutrients(displayFood).map((nutrient, idx) => (
                  <div
                    key={idx}
                    className={`${nutrient.bgColor} rounded-xl p-3 md:p-4 border-2 border-white/50 hover:scale-105 transition-transform cursor-default`}
                  >
                    <div className={`${nutrient.color} mb-2`}>
                      {nutrient.icon}
                    </div>
                    <p className="text-xs text-gray-600 font-medium mb-1">{nutrient.name}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {nutrient.value}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        {nutrient.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional Nutrients */}
              {displayFood.foodNutrients.length > 4 && (
                <div className="border-t-2 border-gray-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-gray-800">Additional Nutrients</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {displayFood.foodNutrients
                      .filter(n => 
                        !['Energy', 'Protein', 'Carbohydrate', 'Total lipid'].some(
                          main => n.nutrientName.includes(main)
                        )
                      )
                      .slice(0, 6)
                      .map((nutrient, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-xs text-gray-600 font-medium truncate pr-2">
                            {nutrient.nutrientName}
                          </span>
                          <span className="text-xs font-bold text-gray-800 flex-shrink-0">
                            {Math.round(nutrient.value * 10) / 10} {nutrient.unitName}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 pt-4 border-t-2 border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  📊 Per 100g serving • Data from USDA FoodData Central
                </p>
              </div>
            </div>
          )}

          {/* Quick Search Suggestions */}
          {!showResults && !error && (
            <div className="mt-4">
              <p className="text-sm text-emerald-50 mb-2 font-medium">🔥 Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Salmon', 'Avocado', 'Quinoa', 'Almonds', 'Greek Yogurt', 'Spinach'].map((food) => (
                  <button
                    key={food}
                    onClick={() => {
                      setSearchQuery(food);
                      searchFoods(food);
                    }}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white hover:bg-white/30 transition-all"
                  >
                    {food}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}