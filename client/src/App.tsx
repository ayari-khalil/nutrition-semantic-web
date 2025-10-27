import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import QueryPage from '@/pages/QueryPage';
import RecipePage from '@/pages/RecipesPage';
import DashboardPage from '@/pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<QueryPage />} />
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;