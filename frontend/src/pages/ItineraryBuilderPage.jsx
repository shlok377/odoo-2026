import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Sun, CloudRain, Plus, Trash2, 
  Share2, Download, DollarSign, ArrowLeft, Check, Sparkles, ChevronRight, Utensils,
  Globe, User, Star, Bookmark
} from 'lucide-react';

export default function ItineraryBuilderPage({ plannedTrip, onNavigate }) {
  const tripData = plannedTrip || {
    city: 'Paris',
    country: 'France',
    title: 'Parisian Dream Getaway',
    days: 5,
    cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    attractions: [
      { id: 'p1', title: 'Eiffel Tower & Champ de Mars', category: 'Landmark', duration: '2.5 hrs', rating: 4.9, image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80' },
      { id: 'p2', title: 'Louvre Museum Guided Tour', category: 'Museum', duration: '3.5 hrs', rating: 4.8, image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80' }
    ],
    foodSpots: [
      { id: 'pf1', title: 'Café de Flore', cuisine: 'Classic French Bistro', price: '$$$', rating: 4.6, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80' }
    ]
  };

  const [activeDay, setActiveDay] = useState(1);
  const [currency, setCurrency] = useState('INR');
  const [toastMsg, setToastMsg] = useState('');

  // Publicly Shared Itineraries Data
  const PUBLIC_ITINERARIES = [
    {
      id: 'pub-1',
      title: '7 Days Cyberpunk Tokyo Exploration',
      author: '@sara_travels',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      city: 'Tokyo, Japan',
      days: 7,
      rating: 4.9,
      cost: '₹ 85,000',
      cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'pub-2',
      title: '5 Days Italian Gastronomy & Ruins',
      author: '@marco_eats',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      city: 'Rome, Italy',
      days: 5,
      rating: 4.8,
      cost: '₹ 62,000',
      cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'pub-3',
      title: '4 Days Romantic Paris & Pastry Walk',
      author: '@elena_p',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      city: 'Paris, France',
      days: 4,
      rating: 4.9,
      cost: '₹ 54,000',
      cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Initial Schedule map by Day
  const [daySchedules, setDaySchedules] = useState({
    1: [
      { id: 'act-1', time: '09:30 AM', title: tripData.attractions[0]?.title || 'Eiffel Tower Tour', category: 'Landmark', cost: 2500, image: tripData.attractions[0]?.image || 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80' },
      { id: 'act-2', time: '01:00 PM', title: tripData.foodSpots[0]?.title || 'Lunch at Café de Flore', category: 'Food & Dining', cost: 1800, image: tripData.foodSpots[0]?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80' },
      { id: 'act-3', time: '04:00 PM', title: tripData.attractions[1]?.title || 'Louvre Museum Visit', category: 'Museum', cost: 2100, image: tripData.attractions[1]?.image || 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80' }
    ],
    2: [
      { id: 'act-4', time: '10:00 AM', title: 'Seine River Sunset Cruise', category: 'Experience', cost: 3200, image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=600&q=80' }
    ],
    3: [],
    4: [],
    5: []
  });

  const currentDayActivities = daySchedules[activeDay] || [];

  const handleAddCustomActivity = () => {
    const newAct = {
      id: 'act-' + Date.now(),
      time: '02:30 PM',
      title: 'Montmartre & Sacré-Cœur Walking Tour',
      category: 'Sightseeing',
      cost: 1500,
      image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=600&q=80'
    };
    setDaySchedules(prev => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || []), newAct]
    }));
    triggerToast('New activity added to Day ' + activeDay);
  };

  const handleDeleteActivity = (id) => {
    setDaySchedules(prev => ({
      ...prev,
      [activeDay]: (prev[activeDay] || []).filter(a => a.id !== id)
    }));
    triggerToast('Activity removed.');
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Compute Total Cost
  const totalCost = Object.values(daySchedules).flat().reduce((sum, item) => sum + (item.cost || 0), 0);

  return (
    <div className="w-100 min-vh-100 py-4 px-3" style={{ color: '#F5EFE9' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* TOP NAVIGATION & BACK BUTTON */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button 
            className="btn btn-pill-outline d-inline-flex align-items-center gap-2"
            onClick={() => onNavigate('planner-flow')}
          >
            <ArrowLeft size={16} />
            <span>Back to Destination Selector</span>
          </button>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-pill-outline d-inline-flex align-items-center gap-1" onClick={() => triggerToast('Link copied to clipboard!')}>
              <Share2 size={16} />
              <span>Share Trip</span>
            </button>
            <button className="btn btn-pill-cream d-inline-flex align-items-center gap-1" onClick={() => window.print()}>
              <Download size={16} />
              <span>Export PDF Schedule</span>
            </button>
          </div>
        </div>

        {/* TRIP HERO HEADER WITH RAIN CHECK STATUS (SOLID FLAT MATTE #3b1417) */}
        <div 
          className="p-4 mb-4 position-relative overflow-hidden rounded-4"
          style={{ 
            backgroundColor: '#3b1417', 
            border: '1px solid #572227', 
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)' 
          }}
        >
          <div className="row g-4 align-items-center">
            
            <div className="col-md-7">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge px-3 py-1 rounded-pill" style={{ backgroundColor: '#591D26', border: '1px solid #572227', color: '#F5EFE9' }}>
                  <MapPin size={12} className="me-1" /> {tripData.city}, {tripData.country}
                </span>
                <span className="badge px-3 py-1 rounded-pill" style={{ backgroundColor: '#290d10', border: '1px solid #572227', color: '#F5EFE9' }}>
                  <Calendar size={12} className="me-1" /> {tripData.days} Days Duration
                </span>
              </div>

              <h1 className="display-4 display-heading text-cream mb-2" style={{ fontSize: '2.4rem' }}>
                {tripData.title}
              </h1>

              {/* Rain Check Live Weather Forecast Alert */}
              <div className="p-3 rounded-3 mt-3 d-inline-flex align-items-center gap-3" style={{ backgroundColor: '#1e402e', border: '1px solid #a7f3d0', color: '#a7f3d0' }}>
                <Sun size={24} />
                <div>
                  <div className="fw-bold small display-heading" style={{ fontSize: '0.9rem' }}>Rain Check Forecast: Clear & Sunny (24°C)</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>100% Outdoor Activities Recommended for Day {activeDay}</div>
                </div>
              </div>
            </div>

            {/* Budget Counter & Currency Selector */}
            <div className="col-md-5 text-md-end border-start-md border-secondary-subtle">
              <span className="small text-cream-muted d-block mb-1" style={{ color: '#D8C8C3', letterSpacing: '0.12em' }}>ESTIMATED TOTAL COST</span>
              <h2 className="display-heading text-cream mb-3" style={{ fontSize: '2.4rem' }}>
                ₹ {totalCost.toLocaleString()}
              </h2>

              <div className="d-inline-flex align-items-center gap-2 p-1.5 rounded-pill" style={{ backgroundColor: '#290d10', border: '1px solid #572227' }}>
                <span className="small text-cream ms-2 me-1" style={{ fontSize: '0.8rem' }}>Currency:</span>
                {['INR', 'USD', 'EUR', 'GBP'].map(curr => (
                  <button
                    key={curr}
                    className={`btn btn-sm ${currency === curr ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                    onClick={() => setCurrency(curr)}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* DAY SELECTOR TABS */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-3 mb-4">
          {Array.from({ length: tripData.days }).map((_, idx) => {
            const dayNum = idx + 1;
            const isSelected = activeDay === dayNum;
            const count = (daySchedules[dayNum] || []).length;
            return (
              <button
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                className={`btn ${isSelected ? 'btn-pill-cream' : 'btn-pill-outline'} px-4 py-2.5 d-flex align-items-center gap-2`}
                style={{ borderRadius: '16px', minWidth: '140px' }}
              >
                <div className="text-start">
                  <div className="fw-bold display-heading" style={{ fontSize: '0.95rem' }}>Day 0{dayNum}</div>
                  <small style={{ fontSize: '0.72rem', opacity: 0.8 }}>{count} Activities</small>
                </div>
              </button>
            );
          })}
        </div>

        {/* DAY TIMELINE & ACTIVITY SCHEDULE (SOLID FLAT MATTE #3b1417) */}
        <div 
          className="p-4 mb-5 rounded-4" 
          style={{ 
            backgroundColor: '#3b1417', 
            border: '1px solid #572227',
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="display-heading text-cream mb-0" style={{ fontSize: '1.75rem' }}>
              Day {activeDay} Schedule
            </h3>
            
            <button 
              className="btn btn-pill-cream d-inline-flex align-items-center gap-2"
              onClick={handleAddCustomActivity}
              style={{ fontSize: '0.88rem', padding: '0.5rem 1.2rem' }}
            >
              <Plus size={16} />
              <span>Add Activity</span>
            </button>
          </div>

          {currentDayActivities.length === 0 ? (
            <div className="text-center py-5 rounded-3" style={{ backgroundColor: '#290d10', border: '1px dashed #572227' }}>
              <Clock size={40} className="text-cream-muted mb-2" />
              <h5 className="display-heading text-cream mb-1">No Activities Scheduled for Day {activeDay}</h5>
              <p className="small text-cream-muted mb-3">Click "+ Add Activity" to schedule sightseeing, meals, or experiences.</p>
              <button className="btn btn-pill-cream" onClick={handleAddCustomActivity}>
                + Schedule Activity
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {currentDayActivities.map((act) => (
                <motion.div
                  key={act.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="p-3.5 rounded-4 d-flex align-items-center justify-content-between gap-3"
                  style={{ backgroundColor: '#290d10', border: '1px solid #572227' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={act.image} 
                      alt={act.title} 
                      className="rounded-3" 
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }} 
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#591D26', color: '#F5EFE9', fontSize: '0.72rem' }}>
                          <Clock size={12} className="me-1" /> {act.time}
                        </span>
                        <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#3b1417', color: '#F5EFE9', fontSize: '0.72rem', border: '1px solid #572227' }}>
                          {act.category}
                        </span>
                      </div>
                      <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.15rem' }}>
                        {act.title}
                      </h5>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold text-cream" style={{ fontSize: '1.1rem' }}>
                      ₹ {act.cost.toLocaleString()}
                    </span>
                    <button 
                      className="btn p-2 text-cream-muted border-0"
                      onClick={() => handleDeleteActivity(act.id)}
                      title="Remove activity"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>


        {/* PUBLICLY SHARED ITINERARIES SECTION AT THE BOTTOM (SOLID FLAT MATTE CARDS) */}
        <div className="mt-5 pt-3">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="badge rounded-pill mb-1 px-3 py-1.5" style={{ backgroundColor: '#591D26', border: '1px solid #572227', color: '#F5EFE9', fontSize: '0.78rem' }}>
                <Globe size={12} className="me-1" /> Community Showcase
              </span>
              <h3 className="display-heading text-cream mb-0" style={{ fontSize: '2rem' }}>
                Publicly Shared Itineraries
              </h3>
            </div>
            <button className="btn btn-pill-outline d-inline-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <span>Explore All Community Trips</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="row g-4">
            {PUBLIC_ITINERARIES.map((item) => (
              <div key={item.id} className="col-md-4">
                <div 
                  className="p-3.5 rounded-4 h-100 hover-lift d-flex flex-column justify-content-between"
                  style={{ 
                    backgroundColor: '#3b1417', 
                    borderRadius: '24px',
                    border: '1px solid #572227',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
                  }}
                >
                  <div>
                    <div className="position-relative mb-3 overflow-hidden rounded-3" style={{ height: '160px' }}>
                      <img src={item.cover} alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#290d10', color: '#F5EFE9', fontSize: '0.75rem', border: '1px solid #572227' }}>
                          <Star size={11} fill="#F5EFE9" className="me-1" /> {item.rating}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-2">
                      <img src={item.avatar} alt={item.author} className="rounded-circle" style={{ width: '24px', height: '24px', objectFit: 'cover' }} />
                      <span className="small text-cream-muted" style={{ fontSize: '0.8rem', color: '#D8C8C3' }}>{item.author}</span>
                    </div>

                    <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.15rem', lineHeight: 1.3 }}>
                      {item.title}
                    </h5>

                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#290d10', color: '#F5EFE9', fontSize: '0.72rem', border: '1px solid #572227' }}>
                        <MapPin size={10} className="me-1" /> {item.city}
                      </span>
                      <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#591D26', color: '#F5EFE9', fontSize: '0.72rem' }}>
                        {item.days} Days
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                    <div>
                      <small className="d-block text-cream-muted" style={{ fontSize: '0.7rem', color: '#D8C8C3' }}>ESTIMATED</small>
                      <span className="fw-bold text-cream" style={{ fontSize: '1rem' }}>{item.cost}</span>
                    </div>
                    <button className="btn btn-sm btn-pill-cream px-3 py-1.5" style={{ fontSize: '0.78rem' }} onClick={() => triggerToast(`Imported ${item.title}`)}>
                      Fork Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-fixed bottom-0 end-0 m-4 px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2"
            style={{ backgroundColor: '#F5EFE9', color: '#591D26', zIndex: 10000, fontWeight: 600 }}
          >
            <Check size={18} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
