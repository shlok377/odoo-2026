import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Bookmark, Users, Shield, Plus, Check, ChevronDown, Camera, X, Heart, Globe, Calendar, Clock, MapPin } from 'lucide-react';

export default function ProfileSettingsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('nancy');
  const [toastMessage, setToastMessage] = useState('');
  
  // Modals
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);

  // New Memory Form
  const [visitPlace, setVisitPlace] = useState('');
  const [visitNote, setVisitNote] = useState('');
  const [visitPhotoUrl, setVisitPhotoUrl] = useState('');

  // New Person Form
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('Companion');

  // Toast Trigger Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  // Profiles State
  const [profiles, setProfiles] = useState({
    nancy: {
      id: 'nancy',
      name: 'Nancy Gajera',
      email: 'nancy@example.com',
      type: 'Primary profile',
      initial: 'N',
      role: 'Travel planner',
      meta: 'Primary profile · 12 trips',
      trips: [
        ['Paris Escape', '5 days · 2 travellers · €850 budget'],
        ['Dubai Weekend', '4 days · 3 travellers · ₹72,000 budget']
      ]
    },
    aarav: {
      id: 'aarav',
      name: 'Aarav Gajera',
      email: 'aarav@example.com',
      type: 'Companion',
      initial: 'A',
      role: 'Companion',
      meta: 'Companion profile · 04 trips',
      trips: [
        ['Goa Adventure', '4 days · 2 travellers · ₹32,000 budget'],
        ['Tokyo Discovery', '7 days · 3 travellers · ¥180,000 budget']
      ]
    },
    family: {
      id: 'family',
      name: 'Family',
      email: 'family@example.com',
      type: 'Group profile',
      initial: 'F',
      role: 'Group travel',
      meta: 'Group profile · 03 trips',
      trips: [
        ['Singapore Family Trip', '6 days · 4 travellers · ₹1,20,000 budget'],
        ['Bali Family Escape', '7 days · 5 travellers · ₹1,05,000 budget']
      ]
    }
  });

  // Travel Memories / Visited Places
  const [memories, setMemories] = useState([
    {
      id: 1,
      country: 'FRANCE',
      year: '2026',
      place: 'Paris',
      note: '“A slow morning walk, tiny cafés and the city lights after sunset.”',
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 2,
      country: 'INDONESIA',
      year: '2025',
      place: 'Bali',
      note: '“The trip where I finally stopped trying to fit everything into one day.”',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 3,
      country: 'UAE',
      year: '2025',
      place: 'Dubai',
      note: '“Desert evenings, city views and a weekend packed with new experiences.”',
      img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80'
    }
  ]);

  // Toggles State
  const [toggles, setToggles] = useState({
    showLowerFares: true,
    preferEV: true,
    preferCarbonOffset: false,
    avoidOverlyPacked: true
  });

  // Chips State
  const [amenityChips, setAmenityChips] = useState({
    'Free Wi-Fi': true,
    'Swimming pool': false,
    'Gym': false,
    'Breakfast': true,
    'Pet friendly': false
  });

  const [activityChips, setActivityChips] = useState({
    'Food': true,
    'Culture': true,
    'Adventure': false,
    'Nature': true,
    'Nightlife': false,
    'Shopping': false
  });

  // Calculate Preferences Count
  const prefCount = Object.keys(toggles).filter(k => toggles[k]).length +
    Object.keys(amenityChips).filter(k => amenityChips[k]).length +
    Object.keys(activityChips).filter(k => activityChips[k]).length + 18;

  const currentProfile = profiles[selectedProfileId] || profiles.nancy;

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAmenityChip = (chip) => {
    setAmenityChips(prev => ({ ...prev, [chip]: !prev[chip] }));
  };

  const handleActivityChip = (chip) => {
    setActivityChips(prev => ({ ...prev, [chip]: !prev[chip] }));
  };

  const handleAddVisit = (e) => {
    e.preventDefault();
    if (!visitPlace.trim()) {
      showToast('Please enter a place name');
      return;
    }
    const newMem = {
      id: Date.now(),
      country: 'EXPLORED',
      year: '2026',
      place: visitPlace,
      note: visitNote ? `“${visitNote}”` : '“A place worth remembering.”',
      img: visitPhotoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&q=80'
    };
    setMemories([newMem, ...memories]);
    setIsVisitModalOpen(false);
    setVisitPlace('');
    setVisitNote('');
    setVisitPhotoUrl('');
    showToast(`${visitPlace} added to your travel journal!`);
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName.trim()) {
      showToast('Please enter a name');
      return;
    }
    const newId = `person_${Date.now()}`;
    const initial = newPersonName.charAt(0).toUpperCase();
    const newProf = {
      id: newId,
      name: newPersonName,
      email: `${newPersonName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      type: newPersonRole,
      initial: initial,
      role: newPersonRole,
      meta: `${newPersonRole} profile · 0 trips`,
      trips: []
    };
    setProfiles(prev => ({ ...prev, [newId]: newProf }));
    setSelectedProfileId(newId);
    showToast(`${newPersonName} profile created!`);
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#3d141a', 
        background: 'radial-gradient(ellipse at 50% -20%, #5c2028 0%, #45171e 55%, #2d0d12 100%)', 
        color: '#dfd2c9', 
        minHeight: '100vh', 
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
      }}
    >
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-fixed shadow-lg rounded px-4 py-3"
            style={{
              right: '24px',
              bottom: '24px',
              backgroundColor: '#dfd2c9',
              color: '#591d26',
              fontWeight: 700,
              zIndex: 9999,
              fontSize: '0.95rem'
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Container */}
      <main className="container py-5" style={{ maxWidth: '1180px' }}>
        
        {/* Page Heading & Profile Switcher Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.15)' }}>
          <div style={{ maxWidth: '580px' }}>
            <div className="text-uppercase fw-bold mb-2" style={{ color: '#cbb8b0', fontSize: '0.85rem', letterSpacing: '0.12em' }}>
              12. PROFILE & SETTINGS
            </div>
            <h1 className="display-3 display-heading text-cream mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, lineHeight: 0.95 }}>
              Your space, your way.
            </h1>
            <p className="m-0 text-cream-muted" style={{ color: '#ddc9c3', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Manage your personal details, travel preferences, companion profiles, and saved destinations from one place.
            </p>
          </div>

          {/* Switch Profile Dropdown Button */}
          <div className="position-relative flex-shrink-0">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="btn d-flex align-items-center gap-3 px-3.5 py-2.5 text-cream rounded-3 border-0 shadow-sm"
              style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}
            >
              <div className="rounded-circle d-grid place-items-center fw-bold" style={{ width: '38px', height: '38px', backgroundColor: '#dfd2c9', color: '#591d26', fontSize: '1rem' }}>
                {currentProfile.initial}
              </div>
              <div className="text-start">
                <div className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>{currentProfile.name}</div>
                <div className="small text-cream-muted" style={{ color: '#cbb8b0', fontSize: '0.75rem' }}>{currentProfile.type}</div>
              </div>
              <ChevronDown size={18} className={`ms-1 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} style={{ color: '#cbb8b0' }} />
            </button>

            {/* Profile Menu Dropdown */}
            {isProfileMenuOpen && (
              <div 
                className="position-absolute end-0 mt-2 p-2 rounded-3 shadow-lg"
                style={{ width: '280px', backgroundColor: '#591d26', border: '1px solid #80545b', zIndex: 100 }}
              >
                <div className="text-uppercase fw-bold px-2 py-1 mb-1" style={{ fontSize: '0.65rem', color: '#cbb8b0', letterSpacing: '0.1em' }}>
                  SWITCH PROFILE
                </div>
                {Object.values(profiles).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProfileId(p.id);
                      setIsProfileMenuOpen(false);
                      showToast(`${p.name} profile selected`);
                    }}
                    className={`w-100 btn text-start d-flex align-items-center gap-2 p-2 rounded-2 mb-1 ${selectedProfileId === p.id ? 'bg-burgundy-soft text-cream' : 'text-cream-muted'}`}
                    style={{ backgroundColor: selectedProfileId === p.id ? '#71343d' : 'transparent', border: 0 }}
                  >
                    <div className="rounded-circle d-grid place-items-center fw-bold flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#dfd2c9', color: '#591d26', fontSize: '0.85rem' }}>
                      {p.initial}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-bold small text-truncate">{p.name}</div>
                      <div className="small opacity-75" style={{ fontSize: '0.7rem' }}>{p.type}</div>
                    </div>
                    {selectedProfileId === p.id && <Check size={16} className="text-cream" />}
                  </button>
                ))}
                <div style={{ height: '1px', backgroundColor: '#80545b', margin: '6px 0' }} />
                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsAddPersonModalOpen(true);
                  }}
                  className="w-100 btn btn-sm border-dashed text-cream text-start p-2"
                  style={{ border: '1px dashed #80545b', backgroundColor: 'transparent' }}
                >
                  + Add another person
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Layout Grid: Sidebar + Content */}
        <div className="row g-4">
          
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="p-3 rounded-3" style={{ backgroundColor: '#591d26', border: '1px solid #80545b', position: 'sticky', top: '100px' }}>
              
              <div className="text-center pb-3 mb-3" style={{ borderBottom: '1px solid #80545b' }}>
                <div className="rounded-circle d-grid place-items-center mx-auto mb-2 fw-bold" style={{ width: '64px', height: '64px', backgroundColor: '#dfd2c9', color: '#591d26', fontSize: '1.6rem' }}>
                  {currentProfile.initial}
                </div>
                <h5 className="fw-bold m-0 text-cream">{currentProfile.name}</h5>
                <span className="small text-cream-muted" style={{ color: '#ddc9c3' }}>{currentProfile.role}</span>
              </div>

              <div className="d-flex flex-column gap-1">
                {[
                  { id: 'profile', label: 'Profile information', icon: User },
                  { id: 'preferences', label: 'Travel preferences', icon: Settings },
                  { id: 'saved', label: 'Saved destinations', icon: Bookmark },
                  { id: 'travelers', label: 'People & trip profiles', icon: Users },
                  { id: 'privacy', label: 'Privacy & account', icon: Shield }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2.5 rounded-2 transition-all ${isActive ? 'bg-cream text-burgundy fw-bold' : 'text-cream-muted'}`}
                      style={{
                        backgroundColor: isActive ? '#dfd2c9' : 'transparent',
                        color: isActive ? '#591d26' : '#cbb8b0',
                        border: 0
                      }}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Content Area */}
          <div className="col-lg-9">
            
            {/* VISITED PLACES / TRAVEL JOURNAL BANNER CARD */}
            <div className="p-4 rounded-3 mb-4 position-relative overflow-hidden" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
              
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
                <div>
                  <div className="text-uppercase fw-bold mb-1" style={{ color: '#ddc9c3', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                    TRAVEL JOURNAL & EXPLORATION HISTORY
                  </div>
                  <h3 className="m-0 text-cream fw-bold display-heading" style={{ fontSize: '1.8rem' }}>
                    Places you've visited
                  </h3>
                  <p className="m-0 small text-cream-muted" style={{ color: '#ddc9c3' }}>
                    Track your travel history and keep a memory of the places that mattered.
                  </p>
                </div>
                <button 
                  onClick={() => setIsVisitModalOpen(true)}
                  className="btn px-3 py-2 rounded-2 fw-bold"
                  style={{ backgroundColor: '#dfd2c9', color: '#591d26', border: '1px solid #dfd2c9' }}
                >
                  + Add visit
                </button>
              </div>

              {/* Stats Bar */}
              <div className="row g-2 mb-4">
                {[
                  { value: '08', label: 'Countries', icon: Globe },
                  { value: '21', label: 'Cities', icon: MapPin },
                  { value: '67', label: 'Travel days', icon: Calendar },
                  { value: '12', label: 'Trips', icon: Heart }
                ].map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <div key={i} className="col-6 col-md-3">
                      <div className="p-3 rounded-2" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
                        <Icon size={16} className="text-cream-muted mb-1" />
                        <div className="fw-bold display-heading text-cream" style={{ fontSize: '1.8rem', lineHeight: 1 }}>{st.value}</div>
                        <div className="small text-cream-muted" style={{ color: '#cbb8b0', fontSize: '0.78rem' }}>{st.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Track */}
              <div className="mb-4">
                <div className="d-flex justify-content-between small text-cream-muted mb-1">
                  <span>World exploration</span>
                  <strong className="text-cream">8 / 30 countries</strong>
                </div>
                <div className="w-100 rounded-pill overflow-hidden" style={{ height: '8px', backgroundColor: '#7a4b54' }}>
                  <div className="h-100 rounded-pill" style={{ width: '27%', backgroundColor: '#dfd2c9' }} />
                </div>
              </div>

              {/* Memory Cards Grid */}
              <div className="d-flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {memories.map((mem) => (
                  <div 
                    key={mem.id}
                    className="rounded-3 overflow-hidden flex-shrink-0"
                    style={{ width: '280px', backgroundColor: '#48171f', border: '1px solid #80545b' }}
                  >
                    <div 
                      style={{ 
                        height: '140px', 
                        backgroundImage: `url(${mem.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }} 
                    />
                    <div className="p-3">
                      <div className="text-uppercase fw-bold" style={{ fontSize: '0.65rem', color: '#cbb8b0', letterSpacing: '0.08em' }}>
                        {mem.country} &bull; {mem.year}
                      </div>
                      <h4 className="fw-bold text-cream m-0 my-1">{mem.place}</h4>
                      <p className="small text-cream-muted mb-2" style={{ color: '#cbb8b0', fontSize: '0.82rem', minHeight: '38px', lineHeight: 1.35 }}>
                        {mem.note}
                      </p>
                      <button 
                        onClick={() => showToast(`${mem.place} memory opened`)}
                        className="btn btn-sm p-0 text-cream fw-bold border-0"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        View memory &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* TAB CONTENT PANELS */}
            
            {/* 1. PROFILE INFORMATION */}
            {activeTab === 'profile' && (
              <div className="p-4 rounded-3" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                <h3 className="fw-bold text-cream mb-1">Profile information</h3>
                <p className="small text-cream-muted mb-4" style={{ color: '#ddc9c3' }}>
                  Keep your Itinera personal account details up to date.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-cream-muted">Full name</label>
                    <input className="form-control text-cream" defaultValue={currentProfile.name} style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-cream-muted">Email address</label>
                    <input className="form-control text-cream" defaultValue={currentProfile.email} style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-cream-muted">Display name</label>
                    <input className="form-control text-cream" defaultValue={currentProfile.name.split(' ')[0]} style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-cream-muted">Language</label>
                    <select className="form-select text-cream" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Gujarati</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-cream-muted">Home currency</label>
                    <select className="form-select text-cream" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                      <option>INR — Indian Rupee (₹)</option>
                      <option>USD — US Dollar ($)</option>
                      <option>EUR — Euro (€)</option>
                      <option>GBP — Pound Sterling (£)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-cream-muted">Time zone</label>
                    <select className="form-select text-cream" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                      <option>India Standard Time (IST)</option>
                      <option>UTC / GMT</option>
                      <option>Eastern Time (US)</option>
                      <option>Central European Time</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid #80545b' }}>
                  <button onClick={() => showToast('Changes discarded')} className="btn text-cream" style={{ border: '1px solid #80545b' }}>Cancel</button>
                  <button onClick={() => showToast('Profile saved successfully!')} className="btn fw-bold" style={{ backgroundColor: '#dfd2c9', color: '#591d26', border: '1px solid #dfd2c9' }}>Save changes</button>
                </div>
              </div>
            )}

            {/* 2. TRAVEL PREFERENCES (07 SECTIONS) */}
            {activeTab === 'preferences' && (
              <div className="p-4 rounded-3" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <div>
                    <h3 className="fw-bold text-cream m-0">Travel preferences</h3>
                    <p className="small text-cream-muted m-0" style={{ color: '#ddc9c3' }}>
                      Set your defaults once. Itinera uses them across flights, stays, bookings and recommendations.
                    </p>
                  </div>
                  <button onClick={() => showToast('Travel preferences saved!')} className="btn fw-bold" style={{ backgroundColor: '#dfd2c9', color: '#591d26', border: '1px solid #dfd2c9' }}>
                    Save preferences
                  </button>
                </div>

                {/* Summary Metrics */}
                <div className="row g-2 mb-4">
                  <div className="col-4">
                    <div className="p-3 rounded-2" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
                      <div className="fw-bold display-heading text-cream" style={{ fontSize: '1.5rem' }}>{prefCount}</div>
                      <div className="small text-cream-muted" style={{ fontSize: '0.75rem' }}>preferences set</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded-2" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
                      <div className="fw-bold display-heading text-cream" style={{ fontSize: '1.5rem' }}>Smart</div>
                      <div className="small text-cream-muted" style={{ fontSize: '0.75rem' }}>search defaults</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 rounded-2" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
                      <div className="fw-bold display-heading text-cream" style={{ fontSize: '1.5rem' }}>Every trip</div>
                      <div className="small text-cream-muted" style={{ fontSize: '0.75rem' }}>profile based</div>
                    </div>
                  </div>
                </div>

                {/* Section 01: Booking & Financial */}
                <div className="pt-3 mb-4" style={{ borderTop: '1px solid #80545b' }}>
                  <div className="fw-bold text-uppercase small mb-2" style={{ color: '#cbb8b0', letterSpacing: '0.1em' }}>01. BOOKING & FINANCIAL</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-cream-muted">Budget tier</label>
                      <select className="form-select text-cream" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                        <option>Value — keep costs low</option>
                        <option>Balanced — best value</option>
                        <option>Comfort — flexible budget</option>
                        <option>Premium — no strict cap</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-cream-muted">Hotel max / night (₹)</label>
                      <input className="form-control text-cream" defaultValue="5000" type="number" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-cream-muted">Fare type</label>
                      <select className="form-select text-cream" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                        <option>Refundable / changeable</option>
                        <option>Either</option>
                        <option>Non-refundable if cheaper</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-cream-muted">Trip budget target (₹)</label>
                      <input className="form-control text-cream" defaultValue="50000" type="number" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} />
                    </div>
                  </div>
                </div>

                {/* Section 02: Aviation & Transit */}
                <div className="pt-3 mb-4" style={{ borderTop: '1px solid #80545b' }}>
                  <div className="fw-bold text-uppercase small mb-2" style={{ color: '#cbb8b0', letterSpacing: '0.1em' }}>02. AVIATION & TRANSIT</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small text-cream-muted">Seating choice</label>
                      <select className="form-select text-cream" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                        <option>Window</option>
                        <option>Aisle</option>
                        <option>Extra legroom</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-cream-muted">Cabin class</label>
                      <select className="form-select text-cream" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                        <option>Economy</option>
                        <option>Premium Economy</option>
                        <option>Business</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center justify-content-between p-3 rounded-2" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
                        <span className="small text-cream">Show lower-fare alternative suggestions</span>
                        <div 
                          onClick={() => handleToggle('showLowerFares')}
                          className="rounded-pill p-1 cursor-pointer transition-all"
                          style={{ width: '46px', height: '26px', backgroundColor: toggles.showLowerFares ? '#dfd2c9' : '#7a4b54', cursor: 'pointer' }}
                        >
                          <div className="rounded-circle h-100 transition-all" style={{ width: '18px', backgroundColor: toggles.showLowerFares ? '#591d26' : '#dfd2c9', marginLeft: toggles.showLowerFares ? '20px' : '0' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 03: Lodging & Amenities */}
                <div className="pt-3 mb-4" style={{ borderTop: '1px solid #80545b' }}>
                  <div className="fw-bold text-uppercase small mb-2" style={{ color: '#cbb8b0', letterSpacing: '0.1em' }}>03. LODGING & AMENITIES</div>
                  <label className="form-label small text-cream-muted mb-2">Must-have hotel amenities</label>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.keys(amenityChips).map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleAmenityChip(chip)}
                        className="btn btn-sm rounded-pill border-0 transition-all"
                        style={{
                          backgroundColor: amenityChips[chip] ? '#dfd2c9' : '#48171f',
                          color: amenityChips[chip] ? '#591d26' : '#cbb8b0',
                          border: amenityChips[chip] ? '1px solid #dfd2c9' : '1px solid #80545b'
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 04: Destination & Activities */}
                <div className="pt-3 mb-4" style={{ borderTop: '1px solid #80545b' }}>
                  <div className="fw-bold text-uppercase small mb-2" style={{ color: '#cbb8b0', letterSpacing: '0.1em' }}>04. DESTINATION & ACTIVITIES</div>
                  <label className="form-label small text-cream-muted mb-2">Favourite activity types</label>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.keys(activityChips).map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleActivityChip(chip)}
                        className="btn btn-sm rounded-pill border-0 transition-all"
                        style={{
                          backgroundColor: activityChips[chip] ? '#dfd2c9' : '#48171f',
                          color: activityChips[chip] ? '#591d26' : '#cbb8b0',
                          border: activityChips[chip] ? '1px solid #dfd2c9' : '1px solid #80545b'
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. SAVED DESTINATIONS */}
            {activeTab === 'saved' && (
              <div className="p-4 rounded-3" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                <h3 className="fw-bold text-cream mb-1">Saved destinations</h3>
                <p className="small text-cream-muted mb-4" style={{ color: '#ddc9c3' }}>
                  Places you've bookmarked for future itineraries.
                </p>

                <div className="row g-3">
                  {[
                    { city: 'Paris', country: 'France', items: '3 saved activities' },
                    { city: 'Bali', country: 'Indonesia', items: '5 saved activities' },
                    { city: 'Tokyo', country: 'Japan', items: '4 saved activities' },
                    { city: 'Singapore', country: 'Singapore', items: '2 saved activities' },
                    { city: 'Dubai', country: 'UAE', items: '3 saved activities' },
                    { city: 'London', country: 'UK', items: '2 saved activities' }
                  ].map((s, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="p-3 rounded-2 hover-lift" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
                        <h4 className="fw-bold text-cream m-0 mb-1">{s.city}</h4>
                        <p className="small text-cream-muted m-0" style={{ color: '#cbb8b0' }}>{s.country} &bull; {s.items}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PEOPLE & TRIP PROFILES */}
            {activeTab === 'travelers' && (
              <div className="p-4 rounded-3" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="fw-bold text-cream m-0">People & trip profiles</h3>
                    <p className="small text-cream-muted m-0" style={{ color: '#ddc9c3' }}>
                      Manage travellers in your group and assign trips.
                    </p>
                  </div>
                  <button onClick={() => setIsAddPersonModalOpen(true)} className="btn px-3 py-2 rounded-2 fw-bold" style={{ backgroundColor: '#dfd2c9', color: '#591d26', border: '1px solid #dfd2c9' }}>
                    + Add person
                  </button>
                </div>

                <div className="row g-3 mb-4">
                  {Object.values(profiles).map((p) => (
                    <div key={p.id} className="col-md-4">
                      <div 
                        className={`p-3 rounded-2 transition-all ${selectedProfileId === p.id ? 'border-cream' : ''}`}
                        style={{ backgroundColor: '#48171f', border: selectedProfileId === p.id ? '1.5px solid #dfd2c9' : '1px solid #80545b' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="rounded-circle d-grid place-items-center fw-bold" style={{ width: '42px', height: '42px', backgroundColor: '#dfd2c9', color: '#591d26' }}>
                            {p.initial}
                          </div>
                          <span className="badge rounded-pill border" style={{ color: '#cbb8b0', borderColor: '#80545b', fontWeight: 400 }}>{p.type}</span>
                        </div>
                        <h4 className="fw-bold text-cream m-0 mb-1">{p.name}</h4>
                        <p className="small text-cream-muted mb-3" style={{ color: '#cbb8b0', fontSize: '0.82rem' }}>{p.meta}</p>
                        <button 
                          onClick={() => {
                            setSelectedProfileId(p.id);
                            showToast(`${p.name} selected as active profile`);
                          }}
                          className="btn btn-sm w-100 fw-bold"
                          style={{ backgroundColor: selectedProfileId === p.id ? '#dfd2c9' : 'transparent', color: selectedProfileId === p.id ? '#591d26' : '#dfd2c9', border: '1px solid #dfd2c9' }}
                        >
                          {selectedProfileId === p.id ? 'Active Profile' : 'Select Profile'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Managed Trips List for Selected Person */}
                <div className="pt-3" style={{ borderTop: '1px solid #80545b' }}>
                  <h4 className="fw-bold text-cream mb-2">Trips assigned to {currentProfile.name}</h4>
                  <div className="d-flex flex-column gap-2">
                    {currentProfile.trips.map((t, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-2" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
                        <div>
                          <strong className="text-cream d-block">{t[0]}</strong>
                          <span className="small text-cream-muted" style={{ color: '#cbb8b0' }}>{t[1]}</span>
                        </div>
                        <button onClick={() => showToast(`Opening ${t[0]}`)} className="btn btn-sm px-3 fw-bold" style={{ backgroundColor: '#dfd2c9', color: '#591d26', border: '1px solid #dfd2c9' }}>
                          Open
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 5. PRIVACY & ACCOUNT */}
            {activeTab === 'privacy' && (
              <div className="p-4 rounded-3" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                <h3 className="fw-bold text-cream mb-1">Privacy & account</h3>
                <p className="small text-cream-muted mb-4" style={{ color: '#ddc9c3' }}>
                  Control your account and personal data.
                </p>

                <p className="small text-cream-muted mb-4" style={{ color: '#cbb8b0', lineHeight: 1.6 }}>
                  You can review your saved information, sign out of your account, or permanently delete your Itinera account. Account deletion should require an additional confirmation step.
                </p>

                <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid #80545b' }}>
                  <button onClick={() => showToast('Signed out')} className="btn text-cream" style={{ border: '1px solid #80545b' }}>
                    Sign out
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your Itinera account? This action cannot be undone.')) {
                        showToast('Account deletion requested');
                      }
                    }} 
                    className="btn fw-bold" 
                    style={{ backgroundColor: 'transparent', color: '#f0dadd', border: '1px solid #c99da4' }}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* ADD VISIT MEMORY MODAL */}
      {isVisitModalOpen && (
        <div className="modal d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20,5,9,0.75)', zIndex: 9999 }}>
          <div className="p-4 rounded-3 shadow-lg position-relative" style={{ width: 'min(480px, 92%)', backgroundColor: '#591d26', border: '1px solid #80545b' }}>
            <button onClick={() => setIsVisitModalOpen(false)} className="btn border-0 text-cream position-absolute top-0 end-0 m-3" style={{ fontSize: '1.4rem' }}>&times;</button>
            <div className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.68rem', color: '#dfd2c9', letterSpacing: '0.1em' }}>NEW TRAVEL MEMORY</div>
            <h3 className="fw-bold text-cream mb-2">Add a visited place</h3>
            <p className="small text-cream-muted mb-3" style={{ color: '#cbb8b0' }}>Add a destination, upload a photo image URL, and write a short memory.</p>
            <form onSubmit={handleAddVisit}>
              <div className="mb-3">
                <label className="form-label small text-cream-muted">Place name</label>
                <input className="form-control text-cream" value={visitPlace} onChange={e => setVisitPlace(e.target.value)} placeholder="e.g. Kyoto, Japan" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} required />
              </div>
              <div className="mb-3">
                <label className="form-label small text-cream-muted">Your memory note</label>
                <textarea className="form-control text-cream" value={visitNote} onChange={e => setVisitNote(e.target.value)} rows={3} placeholder="What made this place special?" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} />
              </div>
              <div className="mb-3">
                <label className="form-label small text-cream-muted">Photo Image URL (Optional)</label>
                <input className="form-control text-cream" value={visitPhotoUrl} onChange={e => setVisitPhotoUrl(e.target.value)} placeholder="https://images.unsplash.com/..." style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} />
              </div>
              <div className="d-flex justify-content-end gap-2 pt-2">
                <button type="button" onClick={() => setIsVisitModalOpen(false)} className="btn text-cream" style={{ border: '1px solid #80545b' }}>Cancel</button>
                <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#dfd2c9', color: '#591d26', border: '1px solid #dfd2c9' }}>Add memory</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PERSON MODAL */}
      {isAddPersonModalOpen && (
        <div className="modal d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20,5,9,0.75)', zIndex: 9999 }}>
          <div className="p-4 rounded-3 shadow-lg position-relative" style={{ width: 'min(450px, 92%)', backgroundColor: '#591d26', border: '1px solid #80545b' }}>
            <button onClick={() => setIsAddPersonModalOpen(false)} className="btn border-0 text-cream position-absolute top-0 end-0 m-3" style={{ fontSize: '1.4rem' }}>&times;</button>
            <div className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.68rem', color: '#dfd2c9', letterSpacing: '0.1em' }}>COMPANION PROFILE</div>
            <h3 className="fw-bold text-cream mb-2">Add another person</h3>
            <p className="small text-cream-muted mb-3" style={{ color: '#cbb8b0' }}>Create a travel profile for a family member or trip companion.</p>
            <form onSubmit={handleAddPerson}>
              <div className="mb-3">
                <label className="form-label small text-cream-muted">Full name</label>
                <input className="form-control text-cream" value={newPersonName} onChange={e => setNewPersonName(e.target.value)} placeholder="e.g. Maya Gajera" style={{ backgroundColor: '#48171f', borderColor: '#80545b' }} required />
              </div>
              <div className="mb-3">
                <label className="form-label small text-cream-muted">Profile type / role</label>
                <select className="form-select text-cream" value={newPersonRole} onChange={e => setNewPersonRole(e.target.value)} style={{ backgroundColor: '#48171f', borderColor: '#80545b' }}>
                  <option>Companion</option>
                  <option>Family member</option>
                  <option>Group member</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddPersonModalOpen(false)} className="btn text-cream" style={{ border: '1px solid #80545b' }}>Cancel</button>
                <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#dfd2c9', color: '#591d26', border: '1px solid #dfd2c9' }}>Create profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
