import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Sun, CloudRain, Plus, Trash2, 
  Share2, Download, DollarSign, ArrowLeft, Check, Sparkles, ChevronRight, Utensils
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
    <div className="w-100 min-vh-100 py-4 px-3" style={{ background: 'linear-gradient(180deg, #591D26 0%, #501A22 72%, #42141B 100%)', color: '#F5EFE9' }}>
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

        {/* TRIP HERO HEADER WITH RAIN CHECK STATUS */}
        <div 
          className="rounded-4 p-4 mb-4 position-relative overflow-hidden"
          style={{ background: '#3e181c', border: '1.5px solid #63262c', boxShadow: '0 16px 36px rgba(0,0,0,0.35)' }}
        >
          <div className="row g-4 align-items-center">
            
            <div className="col-md-7">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge px-3 py-1 rounded-pill" style={{ background: '#591D26', border: '1px solid #F5EFE9', color: '#F5EFE9' }}>
                  <MapPin size={12} className="me-1" /> {tripData.city}, {tripData.country}
                </span>
                <span className="badge px-3 py-1 rounded-pill" style={{ background: '#290d10', color: '#F5EFE9' }}>
                  <Calendar size={12} className="me-1" /> {tripData.days} Days Duration
                </span>
              </div>

              <h1 className="display-4 display-heading text-cream mb-2" style={{ fontSize: '2.5rem' }}>
                {tripData.title}
              </h1>

              {/* Rain Check Live Weather Forecast Alert */}
              <div className="p-3 rounded-3 mt-3 d-inline-flex align-items-center gap-3" style={{ background: '#224833', border: '1px solid #a7f3d0', color: '#a7f3d0' }}>
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

              <div className="d-inline-flex align-items-center gap-2 p-1.5 rounded-pill" style={{ background: '#290d10', border: '1px solid #63262c' }}>
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

        {/* DAY TIMELINE & ACTIVITY SCHEDULE */}
        <div className="p-4 rounded-4 mb-5" style={{ background: '#290d10', border: '1.5px solid #63262c' }}>
          
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="display-heading text-cream mb-0" style={{ fontSize: '1.8rem' }}>
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
            <div className="text-center py-5 rounded-3" style={{ background: '#3e181c', border: '1px dashed #63262c' }}>
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
                  style={{ background: '#3e181c', border: '1.5px solid #63262c' }}
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
                        <span className="badge px-2.5 py-1 rounded-pill" style={{ background: '#591D26', color: '#F5EFE9', fontSize: '0.72rem' }}>
                          <Clock size={12} className="me-1" /> {act.time}
                        </span>
                        <span className="badge px-2.5 py-1 rounded-pill" style={{ background: '#290d10', color: '#F5EFE9', fontSize: '0.72rem' }}>
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

      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-fixed bottom-0 end-0 m-4 px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2"
            style={{ background: '#F5EFE9', color: '#591D26', zIndex: 10000, fontWeight: 600 }}
          >
            <Check size={18} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
