import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Calendar, Search, Filter, Trash2, 
  ChevronRight, Compass, DollarSign, Share2, AlertCircle, Check, ArrowRight
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
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'completed', 'draft'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/trips');
      if (res.data.success && res.data.trips.length > 0) {
        setTrips(res.data.trips);
      }
    } catch (err) {
      console.warn('Using demo trips fallback:', err);
    } finally {
      setLoading(false);
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
    <div className="w-100 min-vh-100 py-5 px-3" style={{ color: '#F5EFE9' }}>
      
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* Header Banner */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid rgba(245, 239, 233, 0.2)' }}>
          <div>
            <span className="small text-cream-muted display-heading" style={{ letterSpacing: '0.14em', color: '#D8C8C3', fontSize: '0.8rem' }}>
              MY TRAVEL JOURNEYS
            </span>
            <h1 className="display-heading text-cream mb-1" style={{ fontSize: '2.6rem' }}>
              My Trips Dashboard
            </h1>
            <p className="small mb-0" style={{ color: '#D8C8C3', fontSize: '0.95rem' }}>
              Manage your saved multi-city travel itineraries, custom budgets, and day-wise schedules.
            </p>
          </div>

          <button 
            className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
            onClick={() => onNavigate('planner-flow')}
            style={{ padding: '0.75rem 1.8rem' }}
          >
            <Plus size={18} />
            <span>Create New Trip</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-6">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-cream-muted" />
              <input 
                type="text"
                className="itinera-input w-100 ps-5"
                style={{ backgroundColor: '#271418', border: '1px solid #4a2027', color: '#F5EFE9' }}
                placeholder="Search by trip name or city (e.g. Paris, Tokyo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Journeys' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'draft', label: 'Drafts' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`btn btn-sm ${activeTab === tab.id ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                style={{ 
                  borderRadius: '9999px',
                  padding: '0.5rem 1.2rem',
                  backgroundColor: activeTab === tab.id ? '#F5EFE9' : '#271418',
                  color: activeTab === tab.id ? '#3e181c' : '#F5EFE9',
                  border: activeTab === tab.id ? 'none' : '1px solid #4a2027'
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-5 my-4 rounded-4" style={{ backgroundColor: '#271418', border: '1px dashed #4a2027' }}>
            <Compass size={48} className="text-cream-muted mb-3" />
            <h4 className="display-heading text-cream mb-2">No Journeys Found</h4>
            <p className="small text-cream-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto', color: '#D8C8C3' }}>
              Create your first travel plan using our step-by-step trip builder wizard.
            </p>
            <button className="btn btn-pill-cream" onClick={() => onNavigate('planner-flow')}>
              + Plan New Journey
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="col-md-6 col-lg-4">
                <motion.div 
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-4 overflow-hidden h-100 d-flex flex-column justify-content-between position-relative"
                  style={{
                    backgroundColor: '#271418',
                    border: '1px solid #4a2027',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenTrip(trip)}
                >
                  {/* Card Cover Photo */}
                  <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
                    <img 
                      src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'} 
                      alt={trip.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div className="position-absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(39,20,24,0.95) 100%)' }} />
                    
                    {/* Delete Icon Button */}
                    <button 
                      className="position-absolute top-0 end-0 m-3 btn btn-sm rounded-circle p-2"
                      style={{ backgroundColor: 'rgba(28, 13, 16, 0.75)', border: '1px solid #4a2027', color: '#F5EFE9' }}
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      title="Delete Trip"
                    >
                      <Trash2 size={15} />
                    </button>

                    {/* Destination Pill */}
                    <div className="position-absolute bottom-0 start-0 m-3">
                      <span className="badge px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#F5EFE9', fontSize: '0.78rem' }}>
                        <MapPin size={11} className="me-1" />
                        {trip.cities_list || 'Multi-City Trip'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <h4 className="display-heading text-cream mb-2" style={{ fontSize: '1.3rem' }}>
                        {trip.title}
                      </h4>
                      
                      <div className="d-flex align-items-center gap-2 small text-cream-muted mb-3" style={{ fontSize: '0.82rem' }}>
                        <Calendar size={13} />
                        <span>{trip.start_date} &rarr; {trip.end_date}</span>
                      </div>

                      {trip.description && (
                        <p className="small text-cream-muted line-clamp-2 mb-3" style={{ fontSize: '0.85rem', color: '#D8C8C3', lineHeight: 1.5 }}>
                          {trip.description}
                        </p>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 mt-2 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                      <div>
                        <span className="small text-cream-muted d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: '#D8C8C3' }}>ESTIMATED BUDGET</span>
                        <strong className="text-cream" style={{ fontSize: '1.1rem' }}>
                          {trip.base_currency === 'INR' ? '₹' : '$'} {Number(trip.total_budget || 0).toLocaleString()}
                        </strong>
                      </div>

                      <button 
                        className="btn btn-sm btn-pill-outline d-inline-flex align-items-center gap-1"
                        style={{ fontSize: '0.8rem', borderRadius: '9999px', padding: '0.4rem 0.9rem' }}
                      >
                        <span>View Trip</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-fixed bottom-0 end-0 m-4 px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2"
            style={{ backgroundColor: '#F5EFE9', color: '#3e181c', zIndex: 10000, fontWeight: 600 }}
          >
            <Check size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
