import React, { useState } from 'react';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import { useAuthStore } from './store/useAuthStore';
import { CheckCircle, ArrowRight, LogOut } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('auth-login');
  const { user, logout } = useAuthStore();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main Content Area - Strictly Page 1 (Login) & Page 2 (Register) */}
      <main className="flex-grow-1 d-flex flex-column justify-content-center">
        {user ? (
          /* Authentication Confirmation Screen */
          <div className="container py-5 text-center">
            <div className="auth-card-centered text-center">
              <div className="p-3 rounded-circle d-inline-block mb-3" style={{ background: '#541c21', border: '1px solid #732a32' }}>
                <CheckCircle size={44} style={{ color: '#f5efe9' }} />
              </div>
              <h2 className="display-heading mb-2" style={{ fontSize: '2rem', color: '#f5efe9' }}>
                Welcome, {user.name}!
              </h2>
              <p className="lead mb-4" style={{ fontSize: '1rem', color: '#cbb8ac' }}>
                Signed in successfully. SQLite Relational DB connected.
              </p>
              <div className="d-flex flex-column gap-2">
                <button 
                  onClick={logout}
                  className="btn btn-pill-outline d-flex align-items-center justify-content-center gap-2"
                >
                  <LogOut size={18} />
                  <span>Sign Out to Auth Preview</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Auth Pages (Login & Register) */
          <AuthPage 
            initialTab={currentPage === 'auth-register' ? 'signup' : 'login'} 
            onAuthSuccess={() => setCurrentPage('dashboard')} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
