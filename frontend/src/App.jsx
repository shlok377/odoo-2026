import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import BudgetCostPage from './pages/BudgetCostPage';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'trips', 'auth-login', 'auth-register', 'budget'
  const { user } = useAuthStore();

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar Header */}
      {currentPage !== 'budget' && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {/* Main Content Router */}
      <main className="flex-grow-1 d-flex flex-column">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'trips' && (
          <MyTripsPage onNavigate={handleNavigate} />
        )}

        {(currentPage === 'auth-login' || currentPage === 'auth-register') && (
          <AuthPage 
            initialTab={currentPage === 'auth-register' ? 'signup' : 'login'} 
            onAuthSuccess={() => handleNavigate('trips')} 
          />
        )}

        {currentPage === 'budget' && (
          <BudgetCostPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      {currentPage !== 'budget' && (
        <Footer />
      )}
    </div>
  );
}
