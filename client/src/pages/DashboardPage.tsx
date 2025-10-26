import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
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
    color: string;
    bgColor: string;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => (
    <Card sx={{ 
      flex: '1 1 200px',
      minWidth: 200,
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
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)' }}>
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

        {/* Statistics Cards using Flexbox */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={<PersonIcon sx={{ fontSize: 32 }} />} color="#667eea" bgColor="#764ba2" />
          <StatCard title="Foods Available" value={stats.totalFoods} icon={<RestaurantIcon sx={{ fontSize: 32 }} />} color="#f093fb" bgColor="#f5576c" />
          <StatCard title="Recipes" value={stats.totalRecipes} icon={<RestaurantIcon sx={{ fontSize: 32 }} />} color="#4facfe" bgColor="#00f2fe" />
          <StatCard title="Physical Activities" value={stats.totalActivities} icon={<FitnessCenterIcon sx={{ fontSize: 32 }} />} color="#43e97b" bgColor="#38f9d7" />
        </Box>

        {/* Recent Activity Section */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Paper sx={{ flex: '1 1 400px', p: 3, minHeight: 300 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              System Health
            </Typography>
            <Box sx={{ mt: 3 }}>
              {['Backend API','Fuseki Server','Ontology Loaded','AI Model'].map((label, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{label}</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <LinearProgress variant="determinate" value={100} color="success" />
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ flex: '1 1 400px', p: 3, minHeight: 300 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                {title: 'Add New User', icon: <PersonIcon />, color: '#667eea', subtitle: 'Create a new user profile'},
                {title: 'Add Food Item', icon: <RestaurantIcon />, color: '#f5576c', subtitle: 'Register new food in database'},
                {title: 'View Analytics', icon: <TrendingUpIcon />, color: '#00f2fe', subtitle: 'Check nutrition trends'},
                {title: 'Track Activities', icon: <FitnessCenterIcon />, color: '#38f9d7', subtitle: 'Log physical activities'}
              ].map((action, idx) => (
                <Card key={idx} sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: action.color }}>{action.icon}</Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">{action.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{action.subtitle}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default DashboardPage;
