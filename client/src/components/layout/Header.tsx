import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  Home,
  BookOpen,
  LayoutDashboard,
  Bell,
  User,
  Menu,
  X,
  Leaf,
  Cpu,
  Database
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export interface HeaderProps {
  className?: string;
  sticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ className = '', sticky = false }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className={`w-full ${sticky ? 'sticky top-0 z-50' : ''} ${className}`}>
      <nav className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-800 dark:via-teal-800 dark:to-emerald-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('/')}>
              <Utensils className="w-8 h-8 text-white" />
              <span className="text-white text-2xl font-bold">NutritionGO</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => handleNavigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Query</span>
              </button>
              <button
                onClick={() => handleNavigate('/recipes')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Recipes</span>
              </button>
              <button
                onClick={() => handleNavigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              {/* Theme Toggle */}
              <div className="ml-2">
                <ThemeToggle />
              </div>

              <button className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-colors ml-2">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 overflow-hidden">
                      <button className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors">
                        Profile
                      </button>
                      <button className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors">
                        Settings
                      </button>
                      <hr className="border-gray-200 dark:border-gray-700" />
                      <button className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Items */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <button
                onClick={() => handleNavigate('/')}
                className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Query</span>
              </button>
              <button
                onClick={() => handleNavigate('/recipes')}
                className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Recipes</span>
              </button>
              <button
                onClick={() => handleNavigate('/dashboard')}
                className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              {/* Theme Toggle for Mobile */}
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header Content */}
      <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950 border-b border-emerald-100 dark:border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg">
                  <Leaf className="text-white w-10 h-10" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  NutritionGO
                </h1>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-4">
                Posez vos questions sur la nutrition en langage naturel
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Cpu className="text-emerald-600 dark:text-emerald-400 w-4 h-4" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">AI-Powered</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/30 rounded-full border border-teal-200 dark:border-teal-800">
                  <Database className="text-teal-600 dark:text-teal-400 w-4 h-4" />
                  <span className="text-sm text-teal-700 dark:text-teal-300 font-medium">Semantic Web</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};