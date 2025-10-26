import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Restaurant as RestaurantIcon,
  FitnessCenter as FitnessCenterIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
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
      // Get total users
      const usersResponse = await axios.post(`${API_BASE_URL}/api/query/sparql`, {
        query: `
          PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(?user) AS ?count) WHERE {
            ?user rdf:type ex:Utilisateur .
          }
        `
      });

      // Get total foods
      const foodsResponse = await axios.post(`${API_BASE_URL}/api/query/sparql`, {
        query: `
          PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(?food) AS ?count) WHERE {
            ?food rdf:type ex:Aliment .
          }
        `
      });

      // Get total recipes
      const recipesResponse = await axios.post(`${API_BASE_URL}/api/query/sparql`, {
        query: `
          PREFIX ex: <http://www.semanticweb.org/gigabytei5/ontologies/2025/9/untitled-ontology-5#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          SELECT (COUNT(?recipe) AS ?count) WHERE {
            ?recipe rdf:type ex:Recette .
          }
        `
      });

      // Get total activities
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
    color: string;
    bgColor: string;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${bgColor} 0%, ${color} 100%)`,
      color: 'white',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" fontWeight="bold">
              {loading ? '...' : value}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'rgba(255,255,255,0.2)' 
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back! Here's what's happening with your nutrition system
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<PersonIcon sx={{ fontSize: 32 }} />}
              color="#667eea"
              bgColor="#764ba2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Foods Available"
              value={stats.totalFoods}
              icon={<RestaurantIcon sx={{ fontSize: 32 }} />}
              color="#f093fb"
              bgColor="#f5576c"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Recipes"
              value={stats.totalRecipes}
              icon={<RestaurantIcon sx={{ fontSize: 32 }} />}
              color="#4facfe"
              bgColor="#00f2fe"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Physical Activities"
              value={stats.totalActivities}
              icon={<FitnessCenterIcon sx={{ fontSize: 32 }} />}
              color="#43e97b"
              bgColor="#38f9d7"
            />
          </Grid>
        </Grid>

        {/* Recent Activity Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                System Health
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Backend API</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <LinearProgress variant="determinate" value={100} color="success" />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Fuseki Server</Typography>
                    <Chip label="Connected" color="success" size="small" />
                  </Box>
                  <LinearProgress variant="determinate" value={100} color="success" />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Ontology Loaded</Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                  <LinearProgress variant="determinate" value={100} color="success" />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">AI Model</Typography>
                    <Chip label="Ready" color="success" size="small" />
                  </Box>
                  <LinearProgress variant="determinate" value={100} color="success" />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Card sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#667eea' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        Add New User
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Create a new user profile
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#f5576c' }}>
                      <RestaurantIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        Add Food Item
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Register new food in database
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#00f2fe' }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        View Analytics
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Check nutrition trends
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#38f9d7' }}>
                      <FitnessCenterIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        Track Activities
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Log physical activities
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Alerts Section */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            System Alerts
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Card sx={{ mb: 2, borderLeft: '4px solid #43e97b' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#43e97b' }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    System Running Smoothly
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    All services are operational • Just now
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2, borderLeft: '4px solid #667eea' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#667eea' }}>
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {stats.totalUsers} Users Registered
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    User database is up to date • 2 hours ago
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderLeft: '4px solid #ffa726' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#ffa726' }}>
                  <WarningIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    API Key Check
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Remember to configure Spoonacular API key • 1 day ago
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default DashboardPage;