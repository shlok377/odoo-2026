import React from 'react';
import { LogOut, Compass, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuthStore();

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3 sticky-top" style={{ background: '#3b1417', borderBottom: '1px solid #572227', zIndex: 1000 }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Brand Logo fetched from /logo.png */}
        <div 
          className="d-flex align-items-center gap-3 cursor-pointer" 
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="Itinera Logo" 
            style={{ height: '60px', objectFit: 'contain' }}
          />
        </div>

        {/* Right Navigation & Auth Actions */}
        <div className="d-flex align-items-center gap-3 flex-nowrap">
          <button 
            onClick={() => onNavigate('home')}
            className={`btn btn-sm text-nowrap ${currentPage === 'home' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            Home
          </button>

          <button 
            onClick={() => onNavigate('planner-flow')}
            className={`btn btn-sm text-nowrap ${currentPage === 'planner-flow' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            Destination Explorer
          </button>

          <button 
            onClick={() => onNavigate('trips')}
            className={`btn btn-sm text-nowrap ${currentPage === 'trips' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            My Trips
          </button>

          <button 
            onClick={() => onNavigate('analytics')}
            className={`btn btn-sm text-nowrap ${currentPage === 'analytics' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            Analytics
          </button>

          <button 
            onClick={() => onNavigate('profile')}
            className={`btn btn-sm text-nowrap ${currentPage === 'profile' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            Profile & Settings
          </button>

          {user ? (
            <div className="d-flex align-items-center gap-3 flex-nowrap">
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill text-nowrap" style={{ background: '#260d10', border: '1px solid #572227', whiteSpace: 'nowrap' }}>
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
                className="btn btn-sm btn-pill-outline d-flex align-items-center gap-1 text-nowrap"
                title="Sign out"
                style={{ borderRadius: '9999px', padding: '0.45rem 1rem', whiteSpace: 'nowrap' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2 flex-nowrap">
              <button 
                onClick={() => onNavigate('auth-login')}
                className={`btn btn-sm text-nowrap ${currentPage === 'auth-login' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                style={{ borderRadius: '9999px', padding: '0.45rem 1.35rem', whiteSpace: 'nowrap' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('auth-register')}
                className={`btn btn-sm text-nowrap ${currentPage === 'auth-register' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                style={{ borderRadius: '9999px', padding: '0.45rem 1.35rem', whiteSpace: 'nowrap' }}
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
