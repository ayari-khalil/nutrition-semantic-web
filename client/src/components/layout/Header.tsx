import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLeaf } from 'react-icons/bi';
import { FiCpu, FiDatabase } from 'react-icons/fi';
import { ThemeToggle } from '@/components/ui';
import { Container } from './Container';
import { config } from '@/config';
import { cn } from '@/utils';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

export interface HeaderProps {
  className?: string;
  sticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ className, sticky = false }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <header
      className={cn(
        'w-full',
        sticky && 'sticky top-0 z-40 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800',
        className
      )}
    >
      {/* Top AppBar / Navbar */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <RestaurantIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            NutitionGO
          </Typography>

          <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ mx: 1 }}>
            Query
          </Button>
          <Button color="inherit" startIcon={<MenuBookIcon />} onClick={() => navigate('/recipes')} sx={{ mx: 1 }}>
            Recipes
          </Button>
          <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => navigate('/dashboard')} sx={{ mx: 1 }}>
            Dashboard
          </Button>

          <IconButton color="inherit" sx={{ mx: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircleIcon sx={{ fontSize: 32 }} />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Header Content Below Navbar */}
      <Container>
        <div className="flex items-center justify-between py-6">
          {/* Logo & Title */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-lg animate-pulse-slow">
                <BiLeaf className="text-white text-4xl" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
                {config.app.name}
              </h1>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-4">
              Posez vos questions sur la nutrition en langage naturel
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                <FiCpu className="text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                  AI-Powered
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                <FiDatabase className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Semantic Web
                </span>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="ml-4">
            <ThemeToggle showLabel />
          </div>
        </div>
      </Container>
    </header>
  );
};
