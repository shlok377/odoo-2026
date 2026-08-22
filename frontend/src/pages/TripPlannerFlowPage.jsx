import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Star, Plus, Check, ArrowRight, 
  Utensils, Camera, ChevronRight, ChevronLeft, Sparkles, Navigation, Globe
} from 'lucide-react';
import axios from 'axios';

const CITY_DATABASE = {
  Paris: {
    country: 'France',
    mapCoords: { top: '34%', left: '47%' },
    cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    attractions: [
      { id: 'p1', title: 'Eiffel Tower & Champ de Mars', category: 'Landmark', duration: '2.5 hrs', rating: 4.9, image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80' },
      { id: 'p2', title: 'Louvre Museum Guided Tour', category: 'Museum', duration: '3.5 hrs', rating: 4.8, image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80' },
      { id: 'p3', title: 'Seine Sunset River Cruise', category: 'Experience', duration: '1.5 hrs', rating: 4.7, image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=600&q=80' },
      { id: 'p4', title: 'Montmartre & Sacré-Cœur Walk', category: 'Walking Tour', duration: '2.0 hrs', rating: 4.8, image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=600&q=80' }
    ],
    foodSpots: [
      { id: 'pf1', title: 'Café de Flore', cuisine: 'Classic French Bistro', price: '$$$', rating: 4.6, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80' },
      { id: 'pf2', title: 'Angelina Paris (Hot Chocolate & Pastries)', cuisine: 'Patisserie', price: '$$', rating: 4.8, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
      { id: 'pf3', title: 'Bistrot Paul Bert', cuisine: 'Traditional Steak Frites', price: '$$$', rating: 4.7, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  Tokyo: {
    country: 'Japan',
    mapCoords: { top: '40%', left: '84%' },
    cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    attractions: [
      { id: 't1', title: 'Shinjuku Gyoen National Garden', category: 'Nature', duration: '2.0 hrs', rating: 4.9, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
      { id: 't2', title: 'Sensō-ji Temple in Asakusa', category: 'Culture', duration: '2.0 hrs', rating: 4.8, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80' },
      { id: 't3', title: 'Shibuya Crossing & Sky Observatory', category: 'Viewpoint', duration: '1.5 hrs', rating: 4.9, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' }
    ],
    foodSpots: [
      { id: 'tf1', title: 'Ichiran Ramen Shibuya', cuisine: 'Tonkotsu Ramen', price: '$', rating: 4.9, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' },
      { id: 'tf2', title: 'Sukiyabashi Jiro Tsukiji', cuisine: 'Premium Omakase Sushi', price: '$$$$', rating: 4.9, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  Rome: {
    country: 'Italy',
    mapCoords: { top: '40%', left: '50%' },
    cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
    attractions: [
      { id: 'r1', title: 'Colosseum & Roman Forum', category: 'Ancient Ruins', duration: '3.0 hrs', rating: 4.9, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
      { id: 'r2', title: 'Trevi Fountain & Spanish Steps', category: 'Landmark', duration: '1.5 hrs', rating: 4.8, image: 'https://images.unsplash.com/photo-1525874684015-5837e7168b5b?auto=format&fit=crop&w=600&q=80' },
      { id: 'r3', title: 'Vatican Museums & Sistine Chapel', category: 'Art & History', duration: '4.0 hrs', rating: 4.9, image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=600&q=80' }
    ],
    foodSpots: [
      { id: 'rf1', title: 'Trattoria Da Enzo al 29', cuisine: 'Classic Roman Carbonara', price: '$$', rating: 4.8, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
      { id: 'rf2', title: 'Giolitti Gelateria', cuisine: 'Artisanal Gelato', price: '$', rating: 4.9, image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  London: {
    country: 'United Kingdom',
    mapCoords: { top: '30%', left: '45%' },
    cover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
    attractions: [
      { id: 'l1', title: 'Tower Bridge & Tower of London', category: 'Landmark', duration: '2.5 hrs', rating: 4.8, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
      { id: 'l2', title: 'British Museum', category: 'Museum', duration: '3.0 hrs', rating: 4.9, image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=600&q=80' }
    ],
    foodSpots: [
      { id: 'lf1', title: 'Dishoom Covent Garden', cuisine: 'Bombay Cafe & Chai', price: '$$', rating: 4.8, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80' }
    ]
  }
};

export default function TripPlannerFlowPage({ onNavigate, onStartItinerary }) {
  const [selectedCity, setSelectedCity] = useState('Paris');
  const [daysCount, setDaysCount] = useState(5);
  const [tripTitle, setTripTitle] = useState('Parisian Dream Getaway');
  const [selectedAttractions, setSelectedAttractions] = useState(['p1', 'p2']);
  const [selectedFoodSpots, setSelectedFoodSpots] = useState(['pf1']);

  const cityData = CITY_DATABASE[selectedCity] || CITY_DATABASE.Paris;

  const handleSelectCity = (cityKey) => {
    setSelectedCity(cityKey);
    setTripTitle(`${cityKey} Travel Exploration`);
    // Pre-select default items for city
    const data = CITY_DATABASE[cityKey];
    if (data) {
      setSelectedAttractions(data.attractions.slice(0, 2).map(a => a.id));
      setSelectedFoodSpots(data.foodSpots.slice(0, 1).map(f => f.id));
    }
  };

  const toggleAttraction = (id) => {
    setSelectedAttractions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleFoodSpot = (id) => {
    setSelectedFoodSpots(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleProceedToItinerary = () => {
    const plannedTrip = {
      city: selectedCity,
      country: cityData.country,
      title: tripTitle,
      days: daysCount,
      attractions: cityData.attractions.filter(a => selectedAttractions.includes(a.id)),
      foodSpots: cityData.foodSpots.filter(f => selectedFoodSpots.includes(f.id)),
      cover: cityData.cover
    };

    if (onStartItinerary) {
      onStartItinerary(plannedTrip);
    } else {
      onNavigate('itinerary-builder');
    }
  };

  return (
    <div className="w-100 min-vh-100 py-4 px-3" style={{ background: 'linear-gradient(180deg, #591D26 0%, #501A22 72%, #42141B 100%)', color: '#F5EFE9' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* HEADER BAR & DAYS SELECTOR */}
        <div className="p-4 rounded-4 mb-4" style={{ background: '#3e181c', border: '1.5px solid #63262c', boxShadow: '0 16px 36px rgba(0,0,0,0.35)' }}>
          <div className="row g-3 align-items-center">
            
            <div className="col-md-5">
              <span className="small text-cream-muted display-heading" style={{ letterSpacing: '0.12em', color: '#D8C8C3' }}>
                TRIP CREATION & MAP DISCOVERY
              </span>
              <input 
                type="text"
                className="itinera-input fw-bold w-100 mt-1"
                style={{ fontSize: '1.4rem', border: 'none', background: '#290d10', color: '#F5EFE9' }}
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
              />
            </div>

            {/* Days Selector Section */}
            <div className="col-md-4">
              <label className="itinera-label text-cream mb-1 d-flex justify-content-between">
                <span>Duration of Stay</span>
                <strong className="text-cream" style={{ color: '#F5EFE9' }}>{daysCount} Days</strong>
              </label>
              <div className="d-flex align-items-center gap-2">
                {[3, 5, 7, 10, 14].map((d) => (
                  <button
                    key={d}
                    className={`btn btn-sm ${daysCount === d ? 'btn-pill-cream' : 'btn-pill-outline'} flex-grow-1`}
                    style={{ fontSize: '0.82rem', padding: '0.45rem 0.5rem' }}
                    onClick={() => setDaysCount(d)}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Itinerary Button */}
            <div className="col-md-3 text-md-end">
              <button 
                onClick={handleProceedToItinerary}
                className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2 w-100 justify-content-center"
                style={{ padding: '0.85rem 1.4rem' }}
              >
                <span>Build Itinerary</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>


        {/* STEP 1: INTERACTIVE MAP & DESTINATION SELECTION */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span className="badge px-3 py-1.5 rounded-pill mb-2" style={{ background: '#591D26', border: '1px solid #F5EFE9', color: '#F5EFE9', fontSize: '0.8rem' }}>
                STEP 01
              </span>
              <h2 className="display-heading text-cream mb-0" style={{ fontSize: '2rem' }}>
                1. Select Your Destination on Map
              </h2>
            </div>
            <span className="small text-cream-muted" style={{ color: '#D8C8C3' }}>
              Selected: <strong style={{ color: '#F5EFE9' }}>{selectedCity}, {cityData.country}</strong>
            </span>
          </div>

          {/* Interactive World Map SVG Container */}
          <div 
            className="rounded-4 position-relative overflow-hidden p-4 d-flex align-items-center justify-content-center"
            style={{ 
              height: '340px', 
              background: '#290d10', 
              border: '1.5px solid #63262c',
              backgroundImage: 'radial-gradient(#4d191f 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* World Continent Outlines Overlay SVG */}
            <svg viewBox="0 0 1000 500" className="w-100 h-100 position-absolute inset-0" style={{ opacity: 0.25 }}>
              <path fill="#F5EFE9" d="M150,120 Q200,80 300,110 T400,200 T250,300 Z M500,100 Q650,50 800,120 T850,250 T650,350 Z M750,320 Q850,300 900,380 Z" />
            </svg>

            {/* Clickable Destination Pins */}
            {Object.keys(CITY_DATABASE).map((cityName) => {
              const cityInfo = CITY_DATABASE[cityName];
              const isSelected = selectedCity === cityName;
              return (
                <motion.div
                  key={cityName}
                  whileHover={{ scale: 1.18 }}
                  onClick={() => handleSelectCity(cityName)}
                  className="position-absolute cursor-pointer d-flex flex-column align-items-center"
                  style={{ 
                    top: cityInfo.mapCoords.top, 
                    left: cityInfo.mapCoords.left, 
                    cursor: 'pointer',
                    zIndex: isSelected ? 20 : 10 
                  }}
                >
                  <div 
                    className="p-2.5 rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                    style={{ 
                      background: isSelected ? '#F5EFE9' : '#591D26', 
                      color: isSelected ? '#3e181c' : '#F5EFE9',
                      border: '2px solid #F5EFE9',
                      width: isSelected ? '44px' : '36px',
                      height: isSelected ? '44px' : '36px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MapPin size={isSelected ? 22 : 18} />
                  </div>
                  <span 
                    className="badge rounded-pill mt-1.5 px-2.5 py-1"
                    style={{ 
                      background: isSelected ? '#F5EFE9' : '#1e090c', 
                      color: isSelected ? '#3e181c' : '#F5EFE9',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: '1px solid #63262c'
                    }}
                  >
                    {cityName}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* STEP 2: SIGHTS & SCENES SELECTION */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span className="badge px-3 py-1.5 rounded-pill mb-2" style={{ background: '#591D26', border: '1px solid #F5EFE9', color: '#F5EFE9', fontSize: '0.8rem' }}>
                STEP 02
              </span>
              <h2 className="display-heading text-cream mb-0" style={{ fontSize: '2rem' }}>
                2. Select Sights & Scenes to Visit in {selectedCity}
              </h2>
            </div>
            <span className="small text-cream-muted" style={{ color: '#D8C8C3' }}>
              {selectedAttractions.length} Attractions Selected
            </span>
          </div>

          <div className="row g-4">
            {cityData.attractions.map((attr) => {
              const isSelected = selectedAttractions.includes(attr.id);
              return (
                <div key={attr.id} className="col-md-6 col-lg-3">
                  <motion.div 
                    whileHover={{ y: -4 }}
                    onClick={() => toggleAttraction(attr.id)}
                    className="rounded-4 overflow-hidden h-100 d-flex flex-column justify-content-between cursor-pointer"
                    style={{
                      background: isSelected ? '#4e1c22' : '#3e181c',
                      border: isSelected ? '2px solid #F5EFE9' : '1.5px solid #63262c',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={attr.image} alt={attr.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span 
                          className="badge rounded-circle p-2 d-flex align-items-center justify-content-center"
                          style={{ 
                            background: isSelected ? '#F5EFE9' : 'rgba(0,0,0,0.6)', 
                            color: isSelected ? '#3e181c' : '#F5EFE9',
                            width: '32px',
                            height: '32px'
                          }}
                        >
                          {isSelected ? <Check size={18} /> : <Plus size={18} />}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="badge rounded-pill" style={{ background: '#591D26', color: '#F5EFE9', fontSize: '0.72rem' }}>
                            {attr.category}
                          </span>
                          <span className="small text-cream d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                            <Star size={13} fill="#F5EFE9" /> {attr.rating}
                          </span>
                        </div>

                        <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.1rem' }}>
                          {attr.title}
                        </h5>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top border-secondary-subtle">
                        <span className="small text-cream-muted d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                          <Clock size={13} /> {attr.duration}
                        </span>
                        <span className={`small fw-bold ${isSelected ? 'text-cream' : 'text-cream-muted'}`} style={{ fontSize: '0.78rem' }}>
                          {isSelected ? '✓ Added' : '+ Add'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>


        {/* STEP 3: FAMOUS FOOD PLACES SELECTION */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span className="badge px-3 py-1.5 rounded-pill mb-2" style={{ background: '#591D26', border: '1px solid #F5EFE9', color: '#F5EFE9', fontSize: '0.8rem' }}>
                STEP 03
              </span>
              <h2 className="display-heading text-cream mb-0" style={{ fontSize: '2rem' }}>
                3. Select Famous Food & Dining Places in {selectedCity}
              </h2>
            </div>
            <span className="small text-cream-muted" style={{ color: '#D8C8C3' }}>
              {selectedFoodSpots.length} Food Spots Selected
            </span>
          </div>

          <div className="row g-4">
            {cityData.foodSpots.map((food) => {
              const isSelected = selectedFoodSpots.includes(food.id);
              return (
                <div key={food.id} className="col-md-6 col-lg-4">
                  <motion.div 
                    whileHover={{ y: -4 }}
                    onClick={() => toggleFoodSpot(food.id)}
                    className="rounded-4 overflow-hidden h-100 d-flex flex-column justify-content-between cursor-pointer"
                    style={{
                      background: isSelected ? '#4e1c22' : '#3e181c',
                      border: isSelected ? '2px solid #F5EFE9' : '1.5px solid #63262c',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={food.image} alt={food.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span 
                          className="badge rounded-circle p-2 d-flex align-items-center justify-content-center"
                          style={{ 
                            background: isSelected ? '#F5EFE9' : 'rgba(0,0,0,0.6)', 
                            color: isSelected ? '#3e181c' : '#F5EFE9',
                            width: '32px',
                            height: '32px'
                          }}
                        >
                          {isSelected ? <Check size={18} /> : <Plus size={18} />}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="badge rounded-pill" style={{ background: '#290d10', color: '#F5EFE9', fontSize: '0.72rem' }}>
                            {food.cuisine}
                          </span>
                          <span className="small text-cream fw-bold" style={{ fontSize: '0.85rem' }}>
                            {food.price}
                          </span>
                        </div>

                        <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.15rem' }}>
                          {food.title}
                        </h5>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top border-secondary-subtle">
                        <span className="small text-cream d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                          <Star size={13} fill="#F5EFE9" /> {food.rating} Rating
                        </span>
                        <span className={`small fw-bold ${isSelected ? 'text-cream' : 'text-cream-muted'}`} style={{ fontSize: '0.78rem' }}>
                          {isSelected ? '✓ Added' : '+ Add Food'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>


        {/* FINAL ACTION BANNER */}
        <div className="p-4 rounded-4 text-center mt-5" style={{ background: '#290d10', border: '1.5px solid #63262c' }}>
          <h3 className="display-heading text-cream mb-2">Ready to Build Day-Wise Schedule?</h3>
          <p className="small text-cream-muted mb-4 mx-auto" style={{ maxWidth: '540px' }}>
            We'll automatically organize your selected {selectedAttractions.length} attractions and {selectedFoodSpots.length} food places across your {daysCount}-day itinerary!
          </p>
          <button 
            onClick={handleProceedToItinerary}
            className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
            style={{ width: 'auto', padding: '0.9rem 2.5rem' }}
          >
            <span>Generate Itinerary Builder &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
