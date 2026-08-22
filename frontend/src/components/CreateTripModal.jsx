import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, MapPin, Calendar, DollarSign, Image, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const POPULAR_CITIES = [
  { city_name: 'Paris', country: 'France' },
  { city_name: 'London', country: 'United Kingdom' },
  { city_name: 'Rome', country: 'Italy' },
  { city_name: 'Amsterdam', country: 'Netherlands' },
  { city_name: 'Tokyo', country: 'Japan' },
  { city_name: 'New York', country: 'USA' },
  { city_name: 'Barcelona', country: 'Spain' },
  { city_name: 'Kyoto', country: 'Japan' }
];

const PRESET_COVERS = [
  { label: 'Paris Eiffel', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
  { label: 'Swiss Alps', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bali Tropics', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rome Colosseum', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' }
];

export default function CreateTripModal({ isOpen, onClose, onTripCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    cover_image_url: PRESET_COVERS[0].url,
    total_budget: 120000,
    base_currency: 'INR',
    stops: [POPULAR_CITIES[0], POPULAR_CITIES[1]]
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCity = (cityObj) => {
    if (!formData.stops.some((c) => c.city_name === cityObj.city_name)) {
      setFormData((prev) => ({ ...prev, stops: [...prev.stops, cityObj] }));
    }
  };

  const handleRemoveCity = (cityName) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((c) => c.city_name !== cityName)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a trip name.');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      setError('Please select both start and end dates.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/trips', formData);
      if (response.data.success) {
        onTripCreated(response.data.trip);
        onClose();
      }
    } catch (err) {
      console.error('Error creating trip:', err);
      // Local fallback for offline/demo mode
      const newTrip = {
        id: Date.now(),
        ...formData,
        cities_list: formData.stops.map((s) => s.city_name).join(' · '),
        stop_count: formData.stops.length
      };
      onTripCreated(newTrip);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="it-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'rgba(15, 5, 7, 0.8)'
        }}
      >
        <motion.div
          className="it-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            width: 'min(640px, 100%)',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '38px',
            background: '#591D26',
            border: '1.5px solid #F5EFE9',
            borderRadius: '20px'
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="small text-cream-muted display-heading" style={{ letterSpacing: '0.12em', color: '#D8C8C3' }}>
                STEP 0{step} OF 03
              </span>
              <h2 className="display-heading text-cream mb-0" style={{ fontSize: '2.2rem' }}>
                {step === 1 && 'Name Your Journey'}
                {step === 2 && 'Dates & Multi-Cities'}
                {step === 3 && 'Budget & Cover Photo'}
              </h2>
            </div>
            <button className="btn p-0 text-cream border-0" onClick={onClose}>
              <X size={26} />
            </button>
          </div>

          {error && (
            <div className="p-3 mb-3 rounded-3" style={{ background: '#72252e', borderLeft: '4px solid #F5EFE9', color: '#F5EFE9' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="d-flex flex-column gap-3">
                <div>
                  <label className="itinera-label text-cream mb-2">Trip Title</label>
                  <input
                    type="text"
                    className="itinera-input w-100"
                    placeholder="e.g. European Summer Exploration"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="itinera-label text-cream mb-2">Trip Description (Optional)</label>
                  <textarea
                    className="itinera-input w-100"
                    rows="3"
                    placeholder="Sightseeing, food tours, museum visits, and relaxed train journeys..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Dates & City Picker */}
            {step === 2 && (
              <div className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="itinera-label text-cream mb-2">Start Date</label>
                    <input
                      type="date"
                      className="itinera-input w-100"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="itinera-label text-cream mb-2">End Date</label>
                    <input
                      type="date"
                      className="itinera-input w-100"
                      value={formData.end_date}
                      onChange={(e) => handleChange('end_date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="itinera-label text-cream mb-2">Selected Destinations ({formData.stops.length})</label>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {formData.stops.map((stop) => (
                      <span
                        key={stop.city_name}
                        className="badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                        style={{ background: '#3b1317', border: '1px solid #F5EFE9', color: '#F5EFE9', fontSize: '0.85rem' }}
                      >
                        <MapPin size={14} />
                        {stop.city_name}
                        <X
                          size={14}
                          className="ms-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveCity(stop.city_name)}
                        />
                      </span>
                    ))}
                  </div>

                  <label className="itinera-label text-cream mb-2">Add Popular Destinations</label>
                  <div className="d-flex flex-wrap gap-2">
                    {POPULAR_CITIES.map((c) => {
                      const isAdded = formData.stops.some((s) => s.city_name === c.city_name);
                      return (
                        <button
                          key={c.city_name}
                          type="button"
                          className={`btn btn-sm ${isAdded ? 'btn-pill-cream' : 'btn-pill-outline'}`}
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                          onClick={() => (isAdded ? handleRemoveCity(c.city_name) : handleAddCity(c))}
                        >
                          {isAdded ? '✓ ' : '+ '} {c.city_name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Budget & Cover Image */}
            {step === 3 && (
              <div className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-7">
                    <label className="itinera-label text-cream mb-2">Target Budget</label>
                    <input
                      type="number"
                      className="itinera-input w-100"
                      placeholder="120000"
                      value={formData.total_budget}
                      onChange={(e) => handleChange('total_budget', e.target.value)}
                    />
                  </div>
                  <div className="col-5">
                    <label className="itinera-label text-cream mb-2">Currency</label>
                    <select
                      className="itinera-input w-100"
                      value={formData.base_currency}
                      onChange={(e) => handleChange('base_currency', e.target.value)}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="itinera-label text-cream mb-2">Select Cover Photo</label>
                  <div className="row g-2">
                    {PRESET_COVERS.map((preset) => {
                      const isSelected = formData.cover_image_url === preset.url;
                      return (
                        <div key={preset.label} className="col-4" onClick={() => handleChange('cover_image_url', preset.url)}>
                          <div
                            className="rounded-3 overflow-hidden position-relative"
                            style={{
                              height: '75px',
                              cursor: 'pointer',
                              border: isSelected ? '3px solid #F5EFE9' : '1px solid #72252e'
                            }}
                          >
                            <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div className="position-absolute bottom-0 inset-x-0 p-1 text-center small text-cream" style={{ background: 'rgba(0,0,0,0.6)', fontSize: '0.7rem' }}>
                              {preset.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Controls */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary-subtle">
              {step > 1 ? (
                <button type="button" className="btn btn-pill-outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft size={16} className="me-1" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button type="button" className="btn btn-pill-cream" onClick={() => setStep(step + 1)}>
                  Next Step <ChevronRight size={16} className="ms-1" />
                </button>
              ) : (
                <button type="submit" className="btn btn-pill-cream" disabled={loading}>
                  {loading ? 'Creating Trip...' : 'Create Trip Now ✨'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
