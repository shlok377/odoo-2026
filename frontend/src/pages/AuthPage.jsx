import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, User, Compass, ArrowRight, 
  CheckCircle2, AlertCircle, ShieldCheck, Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthPage({ initialTab = 'login', onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' or 'signup'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Local state for inline messages
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  const { login, register, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: '#ea4335' };
    if (score <= 50) return { score, label: 'Fair', color: '#fbbc05' };
    if (score <= 75) return { score, label: 'Good', color: '#4285f4' };
    return { score, label: 'Strong', color: '#34a853' };
  };

  const strength = getPasswordStrength(signupPassword);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    clearError();

    if (!loginEmail || !loginPassword) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      setLocalSuccess('Successfully signed in!');
      if (onAuthSuccess) onAuthSuccess();
    } else {
      setLocalError(result.error);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    clearError();

    if (!signupName || !signupEmail || !signupPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setLocalError('You must agree to the Terms of Service.');
      return;
    }

    const result = await register(signupName, signupEmail, signupPassword);
    if (result.success) {
      setLocalSuccess('Account created successfully!');
      if (onAuthSuccess) onAuthSuccess();
    } else {
      setLocalError(result.error);
    }
  };

  // Quick Demo Login
  const handleDemoLogin = async () => {
    setLoginEmail('traveler@itinera.com');
    setLoginPassword('demo123');
    const result = await login('traveler@itinera.com', 'demo123');
    if (result.success) {
      setLocalSuccess('Logged in as Demo Traveler!');
      if (onAuthSuccess) onAuthSuccess();
    } else {
      const regResult = await register('Demo Traveler', 'traveler@itinera.com', 'demo123');
      if (regResult.success) {
        setLocalSuccess('Demo account created and logged in!');
        if (onAuthSuccess) onAuthSuccess();
      } else {
        setLocalError(regResult.error);
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-5 px-3">
      
      {/* Single Centered Solid Dark Burgundy Card Container */}
      <div className="auth-card-centered">
        
        {/* Brand Real Logo & Subtitle */}
        <div className="text-center mb-4">
          <img 
            src="/logo.png" 
            alt="Itinera Logo" 
            className="mb-2"
            style={{ height: '76px', objectFit: 'contain' }}
          />

          <p className="small mb-0 mt-1" style={{ color: '#ddc9c3', fontSize: '0.92rem' }}>
            {activeTab === 'login' ? 'Sign in to access your planned trips' : 'Create an account to start planning trips'}
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="auth-tab-group mb-4">
          <button 
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); clearError(); setLocalError(''); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signup'); clearError(); setLocalError(''); }}
          >
            Register
          </button>
        </div>

        {/* Alert Notifications */}
        <AnimatePresence>
          {(localError || error) && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="alert d-flex align-items-center gap-2 p-3 mb-4 rounded-3"
              style={{ background: 'rgba(230, 92, 101, 0.15)', border: '1px solid #e65c65', color: '#f8b4b8' }}
            >
              <AlertCircle size={18} className="flex-shrink-0 text-danger" />
              <span className="small mb-0 fw-semibold">{localError || error}</span>
            </motion.div>
          )}

          {localSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="alert d-flex align-items-center gap-2 p-3 mb-4 rounded-3"
              style={{ background: 'rgba(52, 168, 83, 0.15)', border: '1px solid #34a853', color: '#a8ebb8' }}
            >
              <CheckCircle2 size={18} className="flex-shrink-0 text-success" />
              <span className="small mb-0 fw-semibold">{localSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAGE 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <motion.form 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleLoginSubmit}
          >
            {/* Email Field */}
            <div className="mb-3">
              <label className="itinera-label">Email Address</label>
              <div className="position-relative">
                <Mail size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#cbb8b0' }} />
                <input 
                  type="email" 
                  className="form-control itinera-input ps-5" 
                  placeholder="name@example.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="itinera-label mb-0">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Use Quick Demo Login below!'); }} className="small text-decoration-none fw-semibold" style={{ color: '#efe2d3', fontSize: '0.82rem' }}>
                  Forgot password?
                </a>
              </div>
              <div className="position-relative">
                <Lock size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#cbb8b0' }} />
                <input 
                  type={showLoginPassword ? "text" : "password"} 
                  className="form-control itinera-input ps-5 pe-5" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                  style={{ color: '#cbb8b0' }}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="form-check mb-4">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="rememberMe" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ backgroundColor: rememberMe ? '#efe2d3' : '#2b0e12', borderColor: '#5a222a' }}
              />
              <label className="form-check-label small fw-medium ms-1" htmlFor="rememberMe" style={{ color: '#ddc9c3' }}>
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn w-100 rounded-pill py-3 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2 hover-lift"
              style={{ backgroundColor: '#efe2d3', color: '#3b1417', border: 'none', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </button>

            {/* Quick Demo Login */}
            <div className="text-center mt-3 pt-3" style={{ borderTop: '1px solid #5a222a' }}>
              <button 
                type="button"
                onClick={handleDemoLogin}
                className="btn w-100 rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 transition-all"
                style={{ backgroundColor: 'rgba(245, 239, 233, 0.06)', color: '#f5efe9', border: '1px solid #80545b' }}
              >
                <Sparkles size={16} style={{ color: '#efe2d3' }} />
                <span>Quick Demo Login</span>
              </button>
            </div>

          </motion.form>
        )}

        {/* PAGE 2: REGISTER FORM */}
        {activeTab === 'signup' && (
          <motion.form 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleSignupSubmit}
          >
            {/* Full Name */}
            <div className="mb-3">
              <label className="itinera-label">Full Name</label>
              <div className="position-relative">
                <User size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#cbb8b0' }} />
                <input 
                  type="text" 
                  className="form-control itinera-input ps-5" 
                  placeholder="Alex Morgan" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-3">
              <label className="itinera-label">Email Address</label>
              <div className="position-relative">
                <Mail size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#cbb8b0' }} />
                <input 
                  type="email" 
                  className="form-control itinera-input ps-5" 
                  placeholder="alex@example.com" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="itinera-label">Password</label>
              <div className="position-relative">
                <Lock size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#cbb8b0' }} />
                <input 
                  type={showSignupPassword ? "text" : "password"} 
                  className="form-control itinera-input ps-5 pe-5" 
                  placeholder="At least 6 characters" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                  style={{ color: '#cbb8b0' }}
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Strength Bar */}
              {signupPassword && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center small mb-1" style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: '#ddc9c3' }}>Strength:</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  </div>
                  <div className="progress" style={{ height: '4px', backgroundColor: '#2b0e12' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${strength.score}%`, backgroundColor: strength.color, transition: 'all 0.3s' }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="itinera-label">Confirm Password</label>
              <div className="position-relative">
                <ShieldCheck size={18} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#cbb8b0' }} />
                <input 
                  type={showSignupPassword ? "text" : "password"} 
                  className="form-control itinera-input ps-5" 
                  placeholder="Re-enter password" 
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="form-check mb-4">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="agreeTerms" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ backgroundColor: agreeTerms ? '#efe2d3' : '#2b0e12', borderColor: '#5a222a' }}
              />
              <label className="form-check-label small fw-medium ms-1" htmlFor="agreeTerms" style={{ color: '#ddc9c3' }}>
                I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: '#efe2d3', fontWeight: 700 }}>Terms of Service</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn w-100 rounded-pill py-3 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2 hover-lift"
              style={{ backgroundColor: '#efe2d3', color: '#3b1417', border: 'none', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  Create Account <ArrowRight size={18} />
                </span>
              )}
            </button>

          </motion.form>
        )}

        {/* Bottom Switcher */}
        <div className="text-center mt-3 pt-2">
          <span className="small fw-medium" style={{ color: '#ddc9c3' }}>
            {activeTab === 'login' ? "Don't have an account?" : "Already registered?"}{' '}
            <button 
              className="btn btn-link p-0 text-decoration-none small fw-bold"
              style={{ color: '#efe2d3' }}
              onClick={() => {
                setActiveTab(activeTab === 'login' ? 'signup' : 'login');
                clearError();
                setLocalError('');
              }}
            >
              {activeTab === 'login' ? 'Register here' : 'Sign in here'}
            </button>
          </span>
        </div>

      </div>
    </div>
  );
}
