import React from 'react';
import { Compass, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuthStore();

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3" style={{ background: '#451a1f', borderBottom: '1px solid #632a30' }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Brand Logo & Name */}
        <div 
          className="d-flex align-items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('auth-login')}
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: '40px', height: '40px', background: '#532328', border: '1px solid #853740' }}
          >
            <Compass size={22} className="text-cream" style={{ color: '#f5efe9' }} />
          </div>
          <div>
            <span className="h3 mb-0 text-cream display-heading" style={{ color: '#f5efe9', fontSize: '1.6rem' }}>
              Itinera
            </span>
          </div>
        </div>

        {/* Right Auth Action Controls */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill" style={{ background: '#2d1014', border: '1px solid #632a30' }}>
                <img 
                  src={user.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} 
                  alt={user.name} 
                  className="rounded-circle"
                  style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                />
                <span className="small text-cream fw-medium" style={{ color: '#f5efe9' }}>{user.name}</span>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-sm btn-pill-outline d-flex align-items-center gap-1"
                title="Sign out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <button 
                onClick={() => onNavigate('auth-login')}
                className={`btn btn-sm ${currentPage === 'auth-login' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                style={{ borderRadius: '9999px', padding: '0.45rem 1.2rem' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('auth-register')}
                className={`btn btn-sm ${currentPage === 'auth-register' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                style={{ borderRadius: '9999px', padding: '0.45rem 1.2rem' }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
