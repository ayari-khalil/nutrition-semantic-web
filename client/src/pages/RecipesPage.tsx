import  { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  FitnessCenter as FitnessCenterIcon,
  LocalFireDepartment as CaloriesIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  TrendingUp as TrendingUpIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:5000';
const SPOONACULAR_API_KEY = '998851e456d54e60bf1907163af22cdc'

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

    // Build query parameters
    const params: any = {
      apiKey: SPOONACULAR_API_KEY,
      number: 12,
      addRecipeNutrition: true,
      maxCalories: caloriesPerMeal + 200,
      minCalories: caloriesPerMeal - 200
    };

    // Add dietary restrictions safely
    if (user.preferences?.some(p => typeof p === 'string' && p.toLowerCase().includes('végétarien'))) {
      params.diet = 'vegetarian';
    }
    if (user.preferences?.some(p => typeof p === 'string' && p.toLowerCase().includes('végan'))) {
      params.diet = 'vegan';
    }

    // Add intolerances safely
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 4, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <RestaurantIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">Personalized Recipe Recommendations</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>AI-powered meal suggestions based on your health goals</Typography>
            </Box>
          </Box>
        </Paper>

        {/* User Selection */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select User</InputLabel>
            <Select value={selectedUser} onChange={(e) => handleUserChange(e.target.value)} label="Select User">
              <MenuItem value=""><em>Choose a user...</em></MenuItem>
              {users.map(u => <MenuItem key={u.name} value={u.name}>{u.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* User Dashboard */}
        {userData && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {[{
              icon: <PersonIcon />, label: userData.name, value: `${userData.age} years`, avatar: true
            }, {
              icon: <FitnessCenterIcon />, label: 'BMI', value: calculateBMI(userData.weight, userData.height)
            }, {
              icon: <CaloriesIcon />, label: 'Daily Calories', value: calculateCalorieNeeds(userData)
            }, {
              icon: <TrendingUpIcon />, label: 'Goal', value: userData.goal
            }].map((item, idx) => (
              <Card key={idx} sx={{ p: 3, borderRadius: 3, flex: '1 1 220px', textAlign: 'center' }}>
                {item.avatar ? (
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>{item.icon}</Avatar>
                ) : <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 1 }}>{item.icon}<Typography variant="subtitle2" color="text.secondary">{item.label}</Typography></Box>}
                <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                {item.label === 'Goal' && <Box sx={{ mt: 1 }}>{userData.preferences?.map((p, i) => <Chip key={i} label={p} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)}</Box>}
              </Card>
            ))}
          </Box>
        )}

        {/* Loading */}
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={60} /></Box>}

        {/* Recipes Grid */}
        {!loading && recipes.length > 0 && (
          <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold">Recommended Recipes ({recipes.length})</Typography>
              <Chip icon={<CheckIcon />} label="Personalized for you" color="success" />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {recipes.map(recipe => (
                <Card key={recipe.id} sx={{ width: 'calc(25% - 16px)', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia component="img" height="200" image={recipe.image} alt={recipe.title} />
                    <IconButton sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', '&:hover': { bgcolor: 'white' } }} onClick={() => toggleFavorite(recipe.id)}>
                      {favorites.includes(recipe.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                    {recipe.healthScore && <Chip label={`Health: ${recipe.healthScore}/100`} size="small" color="success" sx={{ position: 'absolute', bottom: 8, left: 8 }} />}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '3.6em' }}>{recipe.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>{recipe.diets?.slice(0, 2).map((d, i) => <Chip key={i} label={d} size="small" variant="outlined" />)}</Box>
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Tooltip title="Cooking Time"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><TimeIcon fontSize="small" color="action" /><Typography variant="body2" color="text.secondary">{recipe.readyInMinutes} min</Typography></Box></Tooltip>
                        <Tooltip title="Calories"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CaloriesIcon fontSize="small" color="action" /><Typography variant="body2" color="text.secondary">{Math.round(recipe.calories || 0)} cal</Typography></Box></Tooltip>
                      </Box>
                      <Button fullWidth variant="contained" onClick={() => openRecipeDetails(recipe)} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' } }}>View Recipe</Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && selectedUser && (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>No Recipes Found</Typography>
            <Typography variant="body1" color="text.secondary">Try selecting a different user or check your API configuration</Typography>
          </Paper>
        )}

        {/* Recipe Dialog */}
        <Dialog open={Boolean(selectedRecipe)} onClose={() => setSelectedRecipe(null)} maxWidth="md" fullWidth>
          {selectedRecipe && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">{selectedRecipe.title}</Typography>
                  <IconButton onClick={() => setSelectedRecipe(null)}><CloseIcon /></IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <CardMedia component="img" height="300" image={selectedRecipe.image} alt={selectedRecipe.title} sx={{ borderRadius: 2, mb: 3 }} />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                  {['Calories', 'Protein', 'Carbs', 'Fat'].map((nutrient, i) => (
                    <Paper key={i} sx={{ p: 2, textAlign: 'center', flex: '1 1 100px' }}>
                      <Typography variant="h6" fontWeight="bold">{Math.round((selectedRecipe as any)[nutrient.toLowerCase()] || 0)}{nutrient === 'Calories' ? '' : 'g'}</Typography>
                      <Typography variant="caption">{nutrient}</Typography>
                    </Paper>
                  ))}
                </Box>
                {selectedRecipe.summary && <Box><Typography variant="h6" fontWeight="bold" gutterBottom>Description</Typography><Typography variant="body2" dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }} /></Box>}
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setSelectedRecipe(null)}>Close</Button>
                <Button variant="contained" startIcon={<FavoriteIcon />} onClick={() => toggleFavorite(selectedRecipe.id)} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  {favorites.includes(selectedRecipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}

export default RecipePage;
