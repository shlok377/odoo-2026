import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Sun, CloudRain, Plus, Trash2, 
  Share2, Download, DollarSign, ArrowLeft, Check, Sparkles, ChevronRight, Utensils,
  Globe, User, Star, Bookmark, ArrowUpRight
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
    <div className="w-100 min-vh-100 py-4 px-3" style={{ color: '#efe2d3' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* TOP NAVIGATION & BACK BUTTON */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.15)' }}>
          <button 
            className="btn btn-pill-outline d-inline-flex align-items-center gap-2"
            onClick={() => onNavigate('planner-flow')}
            style={{ borderRadius: '9999px', padding: '0.5rem 1.4rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Destination Selector</span>
          </button>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-pill-outline d-inline-flex align-items-center gap-1" style={{ borderRadius: '9999px', padding: '0.5rem 1.2rem' }} onClick={() => triggerToast('Link copied to clipboard!')}>
              <Share2 size={15} />
              <span>Share Trip</span>
            </button>
            <button className="btn btn-pill-cream d-inline-flex align-items-center gap-1" style={{ borderRadius: '9999px', padding: '0.5rem 1.4rem' }} onClick={() => window.print()}>
              <Download size={15} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* TRIP HERO HEADER — BORDERLESS LINE-BASED (NO CARD BOX) */}
        <div className="py-4 mb-4" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.18)' }}>
          <div className="row g-4 align-items-center">
            
            <div className="col-md-7">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="badge px-3 py-1 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3' }}>
                  <MapPin size={12} className="me-1" /> {tripData.city}, {tripData.country}
                </span>
                <span className="badge px-3 py-1 rounded-pill" style={{ backgroundColor: 'transparent', border: '1px solid rgba(239, 226, 211, 0.25)', color: '#efe2d3' }}>
                  <Calendar size={12} className="me-1" /> {tripData.days} Days Duration
                </span>
              </div>

              <h1 className="display-3 display-heading text-cream mb-2" style={{ fontSize: '2.8rem', lineHeight: 1.15 }}>
                {tripData.title}
              </h1>

              {/* Rain Check Live Weather Forecast Alert */}
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mt-2" style={{ backgroundColor: 'rgba(110, 231, 183, 0.08)', border: '1px solid #6ee7b7', color: '#6ee7b7', fontSize: '0.85rem' }}>
                <Sun size={16} />
                <span className="fw-medium">Rain Check: Clear & Sunny (24°C) &bull; 100% Outdoor Friendly</span>
              </div>
            </div>

            {/* Budget Counter & Currency Selector */}
            <div className="col-md-5 text-md-end">
              <span className="small d-block mb-1" style={{ color: '#d5c3b5', letterSpacing: '0.12em', fontSize: '0.78rem' }}>ESTIMATED TOTAL COST</span>
              <h2 className="display-heading text-cream mb-3" style={{ fontSize: '2.8rem', color: '#efe2d3' }}>
                ₹ {totalCost.toLocaleString()}
              </h2>

              <div className="d-inline-flex align-items-center gap-2 p-1 rounded-pill" style={{ border: '1px solid rgba(239, 226, 211, 0.2)' }}>
                <span className="small text-cream ms-2 me-1" style={{ fontSize: '0.78rem', color: '#d5c3b5' }}>Currency:</span>
                {['INR', 'USD', 'EUR', 'GBP'].map(curr => (
                  <button
                    key={curr}
                    className="btn btn-sm text-nowrap"
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: currency === curr ? '#efe2d3' : 'transparent',
                      color: currency === curr ? '#3e181c' : '#efe2d3',
                      border: 'none',
                      fontWeight: currency === curr ? 700 : 500
                    }}
                    onClick={() => setCurrency(curr)}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* DAY SELECTOR TABS — MINIMAL HORIZONTAL LINE */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-3 mb-4" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.12)' }}>
          {Array.from({ length: tripData.days }).map((_, idx) => {
            const dayNum = idx + 1;
            const isSelected = activeDay === dayNum;
            const count = (daySchedules[dayNum] || []).length;
            return (
              <button
                key={dayNum}
                onClick={() => setActiveDay(dayNum)}
                className="btn bg-transparent border-0 px-4 py-2.5 d-flex align-items-center gap-2 position-relative"
                style={{ 
                  minWidth: '130px',
                  color: isSelected ? '#efe2d3' : '#d5c3b5'
                }}
              >
                <div className="text-start">
                  <div className="fw-bold display-heading" style={{ fontSize: '0.95rem' }}>Day 0{dayNum}</div>
                  <small style={{ fontSize: '0.72rem', opacity: 0.8 }}>{count} Activities</small>
                </div>
                {isSelected && (
                  <motion.div 
                    layoutId="activeDayUnderline"
                    className="position-absolute bottom-0 start-0 end-0"
                    style={{ height: '2px', backgroundColor: '#efe2d3', borderRadius: '2px' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* DAY TIMELINE & ACTIVITY SCHEDULE — BORDERLESS LINE-BASED LIST (NO CARDS) */}
        <div className="py-2 mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.15)' }}>
            <h3 className="display-heading text-cream mb-0" style={{ fontSize: '1.8rem' }}>
              Day {activeDay} Schedule
            </h3>
            
            <button 
              className="btn btn-pill-cream d-inline-flex align-items-center gap-2"
              onClick={handleAddCustomActivity}
              style={{ fontSize: '0.88rem', padding: '0.5rem 1.4rem', backgroundColor: '#efe2d3', color: '#3e181c' }}
            >
              <Plus size={16} />
              <span>Add Activity</span>
            </button>
          </div>

          {currentDayActivities.length === 0 ? (
            <div className="text-center py-5" style={{ borderTop: '1px dashed rgba(239, 226, 211, 0.2)', borderBottom: '1px dashed rgba(239, 226, 211, 0.2)' }}>
              <Clock size={40} className="mb-2" style={{ color: '#d5c3b5' }} />
              <h5 className="display-heading text-cream mb-1">No Activities Scheduled for Day {activeDay}</h5>
              <p className="small mb-3" style={{ color: '#d5c3b5' }}>Click "+ Add Activity" to schedule sightseeing, meals, or experiences.</p>
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
                  className="py-3 d-flex align-items-center justify-content-between gap-3"
                  style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.14)' }}
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
                        <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3', fontSize: '0.72rem' }}>
                          <Clock size={12} className="me-1" /> {act.time}
                        </span>
                        <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: 'transparent', border: '1px solid rgba(239, 226, 211, 0.25)', color: '#efe2d3', fontSize: '0.72rem' }}>
                          {act.category}
                        </span>
                      </div>
                      <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.2rem', color: '#efe2d3' }}>
                        {act.title}
                      </h5>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold text-cream" style={{ fontSize: '1.15rem' }}>
                      ₹ {act.cost.toLocaleString()}
                    </span>
                    <button 
                      className="btn p-2 border-0"
                      style={{ color: '#d5c3b5' }}
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


        {/* PUBLICLY SHARED ITINERARIES SECTION AT THE BOTTOM — BORDERLESS ROW SHOWCASE */}
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(239, 226, 211, 0.18)' }}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="small display-heading d-block mb-1" style={{ color: '#d5c3b5', letterSpacing: '0.12em', fontSize: '0.78rem' }}>
                COMMUNITY SHOWCASE
              </span>
              <h3 className="display-heading text-cream mb-0" style={{ fontSize: '2rem' }}>
                Publicly Shared Itineraries
              </h3>
            </div>
            <button className="btn btn-pill-outline d-inline-flex align-items-center gap-2" style={{ fontSize: '0.85rem', borderRadius: '9999px' }}>
              <span>Explore All Community Trips</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="row g-4">
            {PUBLIC_ITINERARIES.map((item) => (
              <div key={item.id} className="col-md-4">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="cursor-pointer d-flex flex-column h-100 pb-3"
                  style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.18)' }}
                >
                  <div className="position-relative mb-3 overflow-hidden rounded-4" style={{ height: '170px' }}>
                    <img src={item.cover} alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: 'rgba(28, 13, 16, 0.75)', color: '#efe2d3', fontSize: '0.75rem', border: '1px solid rgba(239, 226, 211, 0.25)' }}>
                        <Star size={11} fill="#efe2d3" className="me-1" /> {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img src={item.avatar} alt={item.author} className="rounded-circle" style={{ width: '24px', height: '24px', objectFit: 'cover' }} />
                    <span className="small" style={{ fontSize: '0.8rem', color: '#d5c3b5' }}>{item.author}</span>
                  </div>

                  <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.2rem', lineHeight: 1.3 }}>
                    {item.title}
                  </h5>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: 'transparent', border: '1px solid rgba(239, 226, 211, 0.25)', color: '#efe2d3', fontSize: '0.72rem' }}>
                      <MapPin size={10} className="me-1" /> {item.city}
                    </span>
                    <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3', fontSize: '0.72rem' }}>
                      {item.days} Days
                    </span>
                  </div>

                  <div className="pt-3 mt-auto border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                    <div>
                      <small className="d-block" style={{ fontSize: '0.7rem', color: '#d5c3b5' }}>ESTIMATED</small>
                      <span className="fw-bold text-cream" style={{ fontSize: '1rem' }}>{item.cost}</span>
                    </div>
                    <button className="btn btn-sm btn-pill-cream px-3 py-1.5" style={{ fontSize: '0.78rem', backgroundColor: '#efe2d3', color: '#3e181c' }} onClick={() => triggerToast(`Imported ${item.title}`)}>
                      Fork Trip
                    </button>
                  </div>
                </motion.div>
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
            style={{ backgroundColor: '#efe2d3', color: '#3e181c', zIndex: 10000, fontWeight: 600 }}
          >
            <Check size={18} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
