import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BudgetCostPage from './pages/BudgetCostPage';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth-login', 'auth-register', 'budget'
  const { user } = useAuthStore();

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Show Navbar on non-budget pages or customized nav inside budget */}
      {currentPage !== 'budget' && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {/* Main Content Router */}
      <main className="flex-grow-1 d-flex flex-column">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {(currentPage === 'auth-login' || currentPage === 'auth-register') && (
          <AuthPage 
            initialTab={currentPage === 'auth-register' ? 'signup' : 'login'} 
            onAuthSuccess={() => handleNavigate('home')} 
          />
        )}

        {currentPage === 'budget' && (
          <BudgetCostPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Show Footer on non-budget pages */}
      {currentPage !== 'budget' && (
        <Footer />
      )}
    </div>
  );
}
