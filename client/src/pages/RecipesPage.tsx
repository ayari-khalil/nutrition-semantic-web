import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Chip,
  Avatar,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
const SPOONACULAR_API_KEY = 'YOUR_SPOONACULAR_API_KEY'; // Get free key from https://spoonacular.com/food-api

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

  useEffect(() => {
    loadUsers();
  }, []);

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
      console.error('Error loading users:', err);
      setError('Failed to load users');
    }
  };

  const loadUserDetails = async (userName: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Get user weight
      const weightResponse = await axios.post(`${API_BASE_URL}/query`, {
        question: `Quel est le poids de ${userName}?`
      });
      
      // Get user age
      const ageResponse = await axios.post(`${API_BASE_URL}/query`, {
        question: `Quel est l'âge de ${userName}?`
      });
      
      // Get user height
      const heightResponse = await axios.post(`${API_BASE_URL}/query`, {
        question: `Quelle est la taille de ${userName}?`
      });
      
      // Get user goal
      const goalResponse = await axios.post(`${API_BASE_URL}/query`, {
        question: `Quel est l'objectif de ${userName}?`
      });
      
      // Get user allergies
      const allergiesResponse = await axios.post(`${API_BASE_URL}/query`, {
        question: `Quelles sont les allergies de ${userName}?`
      });
      
      // Get user preferences
      const preferencesResponse = await axios.post(`${API_BASE_URL}/query`, {
        question: `Quelles sont les préférences de ${userName}?`
      });

      const user: User = {
        name: userName,
        weight: parseFloat(weightResponse.data.results[0]?.poids || 0),
        age: parseInt(ageResponse.data.results[0]?.age || 0),
        height: parseFloat(heightResponse.data.results[0]?.taille || 0),
        gender: 'male', // You can add this to your ontology
        goal: goalResponse.data.results[0]?.objectif || 'maintenance',
        allergies: allergiesResponse.data.results.map((r: any) => r.allergie) || [],
        preferences: preferencesResponse.data.results.map((r: any) => r.preference) || []
      };

      setUserData(user);
      await fetchRecipes(user);
    } catch (err) {
      console.error('Error loading user details:', err);
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    return (weight / (height * height)).toFixed(1);
  };

  const calculateCalorieNeeds = (user: User) => {
    // Mifflin-St Jeor Equation
    const bmr = user.gender === 'male'
      ? 10 * user.weight + 6.25 * (user.height * 100) - 5 * user.age + 5
      : 10 * user.weight + 6.25 * (user.height * 100) - 5 * user.age - 161;
    
    // Moderate activity multiplier
    const tdee = bmr * 1.55;
    
    // Adjust based on goal
    if (user.goal?.includes('perte') || user.goal?.includes('Perte')) {
      return Math.round(tdee - 500); // Deficit for weight loss
    } else if (user.goal?.includes('masse') || user.goal?.includes('Masse')) {
      return Math.round(tdee + 300); // Surplus for muscle gain
    }
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
      
      // Add dietary restrictions
      if (user.preferences?.some(p => p.toLowerCase().includes('végétarien'))) {
        params.diet = 'vegetarian';
      }
      if (user.preferences?.some(p => p.toLowerCase().includes('végan'))) {
        params.diet = 'vegan';
      }
      
      // Add intolerances
      if (user.allergies && user.allergies.length > 0) {
        params.intolerances = user.allergies.join(',').toLowerCase();
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
    if (userName) {
      loadUserDetails(userName);
    } else {
      setUserData(null);
      setRecipes([]);
    }
  };

  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const openRecipeDetails = async (recipe: Recipe) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/information`,
        { params: { apiKey: SPOONACULAR_API_KEY } }
      );
      setSelectedRecipe({ ...recipe, summary: response.data.summary });
    } catch (err) {
      setSelectedRecipe(recipe);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <RestaurantIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Personalized Recipe Recommendations
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                AI-powered meal suggestions based on your health goals
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* User Selection */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => handleUserChange(e.target.value)}
              label="Select User"
            >
              <MenuItem value="">
                <em>Choose a user...</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.name} value={user.name}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* User Health Dashboard */}
        {userData && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 48 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {userData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.age} years old
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <FitnessCenterIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    BMI
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {calculateBMI(userData.weight, userData.height)}
                </Typography>
                <Chip
                  label="Normal Range"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <CaloriesIcon color="error" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Daily Calories
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {calculateCalorieNeeds(userData)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  kcal/day
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <TrendingUpIcon color="success" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Goal
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {userData.goal || 'Maintenance'}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {userData.preferences?.map((pref, idx) => (
                    <Chip
                      key={idx}
                      label={pref}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Recipes Grid */}
        {!loading && recipes.length > 0 && (
          <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                Recommended Recipes ({recipes.length})
              </Typography>
              <Chip
                icon={<CheckIcon />}
                label="Personalized for you"
                color="success"
              />
            </Box>

            <Grid container spacing={3}>
              {recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={recipe.image}
                        alt={recipe.title}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'white' }
                        }}
                        onClick={() => toggleFavorite(recipe.id)}
                      >
                        {favorites.includes(recipe.id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      {recipe.healthScore && (
                        <Chip
                          label={`Health: ${recipe.healthScore}/100`}
                          size="small"
                          color="success"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8
                          }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '3.6em'
                        }}
                      >
                        {recipe.title}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {recipe.diets?.slice(0, 2).map((diet, idx) => (
                          <Chip
                            key={idx}
                            label={diet}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Tooltip title="Cooking Time">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <TimeIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {recipe.readyInMinutes} min
                              </Typography>
                            </Box>
                          </Tooltip>
                          <Tooltip title="Calories">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CaloriesIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {Math.round(recipe.calories || 0)} cal
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => openRecipeDetails(recipe)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                            }
                          }}
                        >
                          View Recipe
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && selectedUser && (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Recipes Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try selecting a different user or check your API configuration
            </Typography>
          </Paper>
        )}

        {/* Recipe Details Dialog */}
        <Dialog
          open={Boolean(selectedRecipe)}
          onClose={() => setSelectedRecipe(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedRecipe && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedRecipe.title}
                  </Typography>
                  <IconButton onClick={() => setSelectedRecipe(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <CardMedia
                  component="img"
                  height="300"
                  image={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  sx={{ borderRadius: 2, mb: 3 }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <CaloriesIcon color="error" />
                      <Typography variant="h6" fontWeight="bold">
                        {Math.round(selectedRecipe.calories || 0)}
                      </Typography>
                      <Typography variant="caption">Calories</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {Math.round(selectedRecipe.protein || 0)}g
                      </Typography>
                      <Typography variant="caption">Protein</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {Math.round(selectedRecipe.carbs || 0)}g
                      </Typography>
                      <Typography variant="caption">Carbs</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {Math.round(selectedRecipe.fat || 0)}g
                      </Typography>
                      <Typography variant="caption">Fat</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {selectedRecipe.summary && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Description
                    </Typography>
                    <Typography
                      variant="body2"
                      dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}
                    />
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setSelectedRecipe(null)}>Close</Button>
                <Button
                  variant="contained"
                  startIcon={<FavoriteIcon />}
                  onClick={() => toggleFavorite(selectedRecipe.id)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
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