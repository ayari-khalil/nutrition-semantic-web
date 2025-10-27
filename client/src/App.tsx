/**
 * Main Application Component
 * Nutrition AI Assistant with Routing
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Header, Footer } from '@/components';
import { HomePage } from '@/pages/HomePage';
import { UsersPage, DietsPage, NutrientsPage, FoodsPage } from '@/pages/crud';
import DashboardPage from './pages/DashboardPage';
import RecipePage from './pages/RecipesPage';

function Navigation() {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/users', label: 'Users', icon: '👤' },
    { path: '/diets', label: 'Diets', icon: '🥗' },
    { path: '/nutrients', label: 'Nutrients', icon: '💊' },
    { path: '/foods', label: 'Foods', icon: '🍎' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
                  ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }
                `}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header />
        <Navigation />

        <main className="flex-1 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/diets" element={<DietsPage />} />
            <Route path="/nutrients" element={<NutrientsPage />} />
            <Route path="/foods" element={<FoodsPage />} />
            <Route path="/recipes" element={<RecipePage />} />
           <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;