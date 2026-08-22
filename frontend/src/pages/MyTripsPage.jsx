import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Calendar, Search, Trash2, 
  ChevronRight, Compass, Share2, ArrowUpRight, Sparkles, Check
} from 'lucide-react';
import axios from 'axios';
import CreateTripModal from '../components/CreateTripModal';

const DEMO_TRIPS = [
  {
    id: 101,
    title: 'European Summer Vacation',
    description: 'Exploring romantic Paris, scenic Amsterdam canals, and historical Rome landmarks.',
    start_date: '2026-10-10',
    end_date: '2026-10-22',
    cover_image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    total_budget: 120000,
    base_currency: 'INR',
    cities_list: 'Paris · Amsterdam · Rome',
    status: 'upcoming'
  },
  {
    id: 102,
    title: 'Tokyo & Kyoto Autumn Odyssey',
    description: 'High speed bullet trains, ancient temples, tea ceremonies, and vibrant Shibuya nightlife.',
    start_date: '2026-11-05',
    end_date: '2026-11-18',
    cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    total_budget: 250000,
    base_currency: 'INR',
    cities_list: 'Tokyo · Kyoto · Osaka',
    status: 'upcoming'
  },
  {
    id: 103,
    title: 'Swiss Alps & Lakes Escape',
    description: 'Panoramic mountain train rides, glacier hiking, and lake cruises.',
    start_date: '2026-12-01',
    end_date: '2026-12-10',
    cover_image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    total_budget: 180000,
    base_currency: 'INR',
    cities_list: 'Zurich · Lucerne · Interlaken',
    status: 'draft'
  }
];

export default function MyTripsPage({ onNavigate, onStartItinerary }) {
  const [trips, setTrips] = useState(DEMO_TRIPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchTrips = async () => {
    try {
      const res = await axios.get('/api/trips');
      if (res.data.success && res.data.trips.length > 0) {
        setTrips(res.data.trips);
      }
    } catch (err) {
      console.warn('Using demo trips fallback:', err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripCreated = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
    showToast('New trip created successfully! ✨');
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/trips/${id}`);
    } catch (err) {
      console.warn('Deleted locally:', err);
    }
    setTrips((prev) => prev.filter((t) => t.id !== id));
    showToast('Trip removed.');
  };

  const handleOpenTrip = (trip) => {
    if (onStartItinerary) {
      onStartItinerary({
        city: trip.cities_list?.split('·')[0]?.trim() || 'Paris',
        country: 'Travel Destination',
        title: trip.title,
        days: 5,
        cover: trip.cover_image_url,
        attractions: [],
        foodSpots: []
      });
    } else {
      onNavigate('itinerary-builder');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.cities_list && trip.cities_list.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && (trip.status === activeTab || (activeTab === 'upcoming' && !trip.status));
  });

  return (
    <div className="w-100 min-vh-100 py-5 px-3" style={{ color: '#efe2d3' }}>
      
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* EDITORIAL HEADER WITH THIN ACCENT DIVIDER LINE */}
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.18)' }}>
          <div>
            <span className="small display-heading" style={{ letterSpacing: '0.16em', color: '#d5c3b5', fontSize: '0.8rem' }}>
              MY TRAVEL JOURNEYS
            </span>
            <h1 className="display-heading mb-1" style={{ fontSize: '3rem', color: '#efe2d3', lineHeight: 1.1 }}>
              My Trips Dashboard
            </h1>
            <p className="small mb-0" style={{ color: '#d5c3b5', fontSize: '0.95rem' }}>
              Explore saved travel plans, multi-city itineraries, and custom budgets.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-pill-cream d-inline-flex align-items-center gap-2"
            onClick={() => onNavigate('planner-flow')}
            style={{ padding: '0.75rem 1.8rem', backgroundColor: '#efe2d3', color: '#3e181c' }}
          >
            <Plus size={18} />
            <span>Create New Trip</span>
          </motion.button>
        </div>

        {/* MINIMAL SEARCH & TAB FILTER LINE BAR */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.1)' }}>
          
          <div className="position-relative" style={{ maxWidth: '420px', width: '100%' }}>
            <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-cream-muted" style={{ color: '#d5c3b5' }} />
            <input 
              type="text"
              className="bg-transparent border-0 border-bottom text-cream ps-4 py-2 w-100"
              style={{ color: '#efe2d3', borderColor: 'rgba(239, 226, 211, 0.2)', outline: 'none', fontSize: '0.95rem' }}
              placeholder="Search journeys by title or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            {[
              { id: 'all', label: 'All Journeys' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'draft', label: 'Drafts' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn btn-sm bg-transparent border-0 position-relative py-2 px-1 text-nowrap"
                style={{ 
                  color: activeTab === tab.id ? '#efe2d3' : '#d5c3b5', 
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.9rem'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="position-absolute bottom-0 start-0 end-0"
                    style={{ height: '2px', backgroundColor: '#efe2d3', borderRadius: '2px' }}
                  />
                )}
              </button>
            ))}
          </div>

        </div>

        {/* CLEAN BORDERLESS LINE-BASED GRID (NO CARDS) */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-5 my-5" style={{ borderTop: '1px dashed rgba(239, 226, 211, 0.2)', borderBottom: '1px dashed rgba(239, 226, 211, 0.2)' }}>
            <Compass size={44} className="mb-3" style={{ color: '#d5c3b5' }} />
            <h4 className="display-heading text-cream mb-2">No Journeys Found</h4>
            <p className="small mb-4" style={{ color: '#d5c3b5', maxWidth: '380px', margin: '0 auto' }}>
              Create your first travel plan using our step-by-step trip builder wizard.
            </p>
            <button className="btn btn-pill-cream" onClick={() => onNavigate('planner-flow')}>
              + Plan New Journey
            </button>
          </div>
        ) : (
          <div className="row g-5">
            {filteredTrips.map((trip, idx) => (
              <div key={trip.id} className="col-md-6 col-lg-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  whileHover="hover"
                  onClick={() => handleOpenTrip(trip)}
                  className="cursor-pointer d-flex flex-column h-100 position-relative pb-4"
                  style={{ 
                    borderBottom: '1px solid rgba(239, 226, 211, 0.18)',
                    cursor: 'pointer'
                  }}
                >
                  {/* Image Container with Smooth Scale Animation */}
                  <div className="position-relative overflow-hidden rounded-4 mb-3" style={{ height: '220px' }}>
                    <motion.img 
                      variants={{ hover: { scale: 1.05 } }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'} 
                      alt={trip.title} 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover' }} 
                    />
                    
                    {/* Delete Icon Button */}
                    <button 
                      className="position-absolute top-0 end-0 m-3 btn btn-sm rounded-circle p-2"
                      style={{ backgroundColor: 'rgba(28, 13, 16, 0.65)', border: '1px solid rgba(239, 226, 211, 0.2)', color: '#efe2d3' }}
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      title="Delete Trip"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Destination Tag */}
                    <div className="position-absolute bottom-0 start-0 m-3">
                      <span className="badge px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3', fontSize: '0.78rem' }}>
                        <MapPin size={11} className="me-1" />
                        {trip.cities_list || 'Multi-City Trip'}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Content */}
                  <div className="d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="small text-cream-muted" style={{ fontSize: '0.78rem', color: '#d5c3b5' }}>
                          <Calendar size={12} className="me-1" />
                          {trip.start_date} &rarr; {trip.end_date}
                        </span>
                        
                        <motion.span 
                          variants={{ hover: { x: 4 } }}
                          transition={{ duration: 0.2 }}
                          className="d-inline-flex align-items-center gap-1 small fw-bold"
                          style={{ color: '#efe2d3', fontSize: '0.85rem' }}
                        >
                          <span>Explore</span>
                          <ArrowUpRight size={14} />
                        </motion.span>
                      </div>

                      <h3 className="display-heading text-cream mb-2" style={{ fontSize: '1.45rem', color: '#efe2d3', lineHeight: 1.25 }}>
                        {trip.title}
                      </h3>

                      {trip.description && (
                        <p className="small mb-3" style={{ fontSize: '0.88rem', color: '#d5c3b5', lineHeight: 1.55 }}>
                          {trip.description}
                        </p>
                      )}
                    </div>

                    {/* Thin Line Accent & Budget */}
                    <div className="pt-3 d-flex align-items-center justify-content-between" style={{ borderTop: '1px solid rgba(239, 226, 211, 0.12)' }}>
                      <span className="small" style={{ fontSize: '0.78rem', color: '#d5c3b5', letterSpacing: '0.06em' }}>ESTIMATED BUDGET</span>
                      <span className="fw-bold" style={{ fontSize: '1.15rem', color: '#efe2d3' }}>
                        {trip.base_currency === 'INR' ? '₹' : '$'} {Number(trip.total_budget || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                </motion.div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTripCreated={handleTripCreated}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-fixed bottom-0 end-0 m-4 px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2"
            style={{ backgroundColor: '#efe2d3', color: '#3e181c', zIndex: 10000, fontWeight: 600 }}
          >
            <Check size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
