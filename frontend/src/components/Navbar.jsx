import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Compass, MapPin, BarChart2, User, ChevronDown, Settings, DollarSign } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (page) => {
    setIsDropdownOpen(false);
    onNavigate(page);
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3 sticky-top" style={{ background: '#3b1417', borderBottom: '1px solid #572227', zIndex: 1000 }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Brand Logo */}
        <div 
          className="d-flex align-items-center gap-3 cursor-pointer" 
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="Itinera Logo" 
            style={{ height: '80px', objectFit: 'contain' }}
          />
        </div>

        {/* Clean Primary Navigation Links */}
        <div className="d-flex align-items-center gap-2 flex-nowrap">
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
            onClick={() => onNavigate('community')}
            className={`btn btn-sm text-nowrap ${currentPage === 'community' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            Community
          </button>

          {/* Sleek User Account / Insights Dropdown */}
          <div className="position-relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`btn btn-sm text-nowrap d-flex align-items-center gap-1.5 ${['analytics', 'profile', 'budget'].includes(currentPage) ? 'btn-pill-cream' : 'btn-pill-outline'}`}
              style={{ borderRadius: '9999px', padding: '0.45rem 1.1rem', whiteSpace: 'nowrap' }}
            >
              <span>Account & Insights</span>
              <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </button>

            {/* Dropdown Menu Popup */}
            {isDropdownOpen && (
              <div 
                className="position-absolute end-0 mt-2 py-2 rounded-4 shadow-lg"
                style={{ 
                  backgroundColor: '#48171f', 
                  border: '1px solid rgba(223, 210, 201, 0.2)', 
                  minWidth: '220px', 
                  zIndex: 1100,
                  backdropFilter: 'blur(12px)'
                }}
              >
                <button 
                  onClick={() => handleMenuClick('analytics')}
                  className="w-100 btn btn-link text-start text-cream text-decoration-none px-3.5 py-2 d-flex align-items-center gap-2.5 transition-all"
                  style={{ color: currentPage === 'analytics' ? '#efe2d3' : '#cbb8b0', fontSize: '0.88rem' }}
                >
                  <BarChart2 size={16} style={{ color: '#d96b74' }} />
                  <span>Analytics & Insights</span>
                </button>

                <button 
                  onClick={() => handleMenuClick('budget')}
                  className="w-100 btn btn-link text-start text-cream text-decoration-none px-3.5 py-2 d-flex align-items-center gap-2.5 transition-all"
                  style={{ color: currentPage === 'budget' ? '#efe2d3' : '#cbb8b0', fontSize: '0.88rem' }}
                >
                  <DollarSign size={16} style={{ color: '#efe2d3' }} />
                  <span>Budget & Expenses</span>
                </button>

                <button 
                  onClick={() => handleMenuClick('profile')}
                  className="w-100 btn btn-link text-start text-cream text-decoration-none px-3.5 py-2 d-flex align-items-center gap-2.5 transition-all"
                  style={{ color: currentPage === 'profile' ? '#efe2d3' : '#cbb8b0', fontSize: '0.88rem' }}
                >
                  <Settings size={16} style={{ color: '#ddc9c3' }} />
                  <span>Profile & Settings</span>
                </button>

                {user && (
                  <>
                    <div style={{ height: '1px', backgroundColor: 'rgba(223, 210, 201, 0.12)', margin: '0.4rem 0' }} />
                    <button 
                      onClick={() => { setIsDropdownOpen(false); logout(); }}
                      className="w-100 btn btn-link text-start text-decoration-none px-3.5 py-2 d-flex align-items-center gap-2.5"
                      style={{ color: '#d96b74', fontSize: '0.88rem' }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Far Right Auth Actions */}
          {user ? (
            <div className="d-flex align-items-center gap-2 ms-2">
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill text-nowrap" style={{ background: '#260d10', border: '1px solid #572227', whiteSpace: 'nowrap' }}>
                <img 
                  src={user.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} 
                  alt={user.name} 
                  className="rounded-circle"
                  style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                />
                <span className="small text-cream fw-medium" style={{ color: '#f5efe9' }}>{user.name}</span>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2 ms-2">
              <button 
                onClick={() => onNavigate('auth-login')}
                className={`btn btn-sm text-nowrap ${currentPage === 'auth-login' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                style={{ borderRadius: '9999px', padding: '0.45rem 1.2rem', whiteSpace: 'nowrap' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('auth-register')}
                className={`btn btn-sm text-nowrap ${currentPage === 'auth-register' ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                style={{ borderRadius: '9999px', padding: '0.45rem 1.2rem', whiteSpace: 'nowrap' }}
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
