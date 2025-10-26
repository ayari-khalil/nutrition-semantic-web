import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Box
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <RestaurantIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          NutriSmart AI
        </Typography>
        
        <Button 
          color="inherit" 
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mx: 1 }}
        >
          Query
        </Button>
        
        <Button 
          color="inherit" 
          startIcon={<MenuBookIcon />}
          onClick={() => navigate('/recipes')}
          sx={{ mx: 1 }}
        >
          Recipes
        </Button>

        <Button 
          color="inherit" 
          startIcon={<DashboardIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mx: 1 }}
        >
          Dashboard
        </Button>

        <IconButton color="inherit" sx={{ mx: 1 }}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton 
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <AccountCircleIcon sx={{ fontSize: 32 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;