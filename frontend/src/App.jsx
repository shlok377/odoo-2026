import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth-login', 'auth-register'
  const { user } = useAuthStore();

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar Header with logo.png */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
