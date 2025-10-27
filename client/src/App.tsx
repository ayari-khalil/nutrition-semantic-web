/**
 * Main Application Component
 * Nutrition AI Assistant with Routing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from '@/components';
import { UsersPage, DietsPage, NutrientsPage, FoodsPage } from '@/pages/crud';
import DashboardPage from './pages/DashboardPage';
import RecipePage from './pages/RecipesPage';
import Home from './pages/Home';
import QueryPage from './pages/QueryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-1">
          
          <Routes>
            <Route path="/" element={<QueryPage />} />
            <Route path="/home" element={<Home />} />
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