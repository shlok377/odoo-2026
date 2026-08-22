import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Star, Plus, Check, ArrowRight, ArrowLeft,
  Utensils, Camera, ChevronRight, Sparkles, Navigation, Globe
} from 'lucide-react';

const CITY_DATABASE = {
  Paris: {
    country: 'France',
    subtitle: 'The City of Light & Art',
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
      { id: 'pf2', title: 'Angelina Paris (Hot Chocolate)', cuisine: 'Patisserie', price: '$$', rating: 4.8, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
      { id: 'pf3', title: 'Bistrot Paul Bert', cuisine: 'Traditional Steak Frites', price: '$$$', rating: 4.7, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  Tokyo: {
    country: 'Japan',
    subtitle: 'High Tech & Ancient Culture',
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
    subtitle: 'Eternal City & Architecture',
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
    subtitle: 'Royal Palaces & Global Cuisine',
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
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState('Paris');
  const [daysCount, setDaysCount] = useState(5);
  const [tripTitle, setTripTitle] = useState('Parisian Dream Getaway');
  const [selectedAttractions, setSelectedAttractions] = useState(['p1', 'p2']);
  const [selectedFoodSpots, setSelectedFoodSpots] = useState(['pf1']);

  const cityData = CITY_DATABASE[selectedCity] || CITY_DATABASE.Paris;

  const handleSelectCity = (cityKey) => {
    setSelectedCity(cityKey);
    setTripTitle(`${cityKey} Travel Exploration`);
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

  const handleProceedToNextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
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
    }
  };

  return (
    <div className="w-100 min-vh-100 py-5 px-3 d-flex flex-column align-items-center" style={{ background: 'linear-gradient(180deg, #591D26 0%, #501A22 72%, #42141B 100%)', color: '#F5EFE9' }}>
      
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* STEPPER PROGRESS NAVIGATION HEADER */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-5 pb-3" style={{ borderBottom: '1px solid rgba(245, 239, 233, 0.22)' }}>
          <div>
            <span className="small text-cream-muted display-heading" style={{ letterSpacing: '0.14em', color: '#D8C8C3' }}>
              TRIP BUILDER WIZARD
            </span>
            <h1 className="display-heading text-cream mb-0" style={{ fontSize: '2.5rem' }}>
              Design Your Journey
            </h1>
          </div>

          {/* Clean Rounded Step Indicators */}
          <div className="d-flex align-items-center gap-2">
            {[
              { num: 1, label: 'Destination' },
              { num: 2, label: 'Sights & Scenes' },
              { num: 3, label: 'Food Places' }
            ].map((st) => (
              <div 
                key={st.num}
                onClick={() => st.num <= wizardStep && setWizardStep(st.num)}
                className="d-flex align-items-center gap-2 px-3.5 py-2 rounded-pill"
                style={{ 
                  background: wizardStep === st.num ? '#F5EFE9' : '#3e181c', 
                  color: wizardStep === st.num ? '#3e181c' : '#F5EFE9',
                  border: '1.5px solid #63262c',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: st.num <= wizardStep ? 'pointer' : 'default'
                }}
              >
                <span>0{st.num}. {st.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIZARD CONTENT ANIMATION */}
        <AnimatePresence mode="wait">
          
          {/* STEP 1: DESTINATION & DAYS SELECTOR */}
          {wizardStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column gap-4"
            >
              {/* Trip Title & Duration Box */}
              <div className="p-4 rounded-4" style={{ background: '#3e181c', border: '1.5px solid #63262c', boxShadow: '0 16px 36px rgba(0,0,0,0.35)' }}>
                <div className="row g-4 align-items-center">
                  <div className="col-md-6">
                    <label className="itinera-label text-cream mb-2">Trip Title</label>
                    <input 
                      type="text"
                      className="itinera-input fw-bold w-100"
                      style={{ fontSize: '1.2rem', background: '#290d10', color: '#F5EFE9' }}
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="itinera-label text-cream mb-2">Duration of Stay</label>
                    <div className="d-flex align-items-center gap-2">
                      {[3, 5, 7, 10, 14].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`btn btn-sm ${daysCount === d ? 'btn-pill-cream' : 'btn-pill-outline'} flex-grow-1`}
                          style={{ fontSize: '0.85rem', padding: '0.55rem 0.5rem' }}
                          onClick={() => setDaysCount(d)}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Interactive Map */}
              <div className="p-4 rounded-4" style={{ background: '#3e181c', border: '1.5px solid #63262c' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h4 className="display-heading text-cream mb-1">Select Destination City</h4>
                    <small style={{ color: '#D8C8C3' }}>Click a location pin on the map to set your destination.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ background: '#290d10', color: '#F5EFE9', fontSize: '0.85rem' }}>
                    Selected: {selectedCity}, {cityData.country}
                  </span>
                </div>

                <div 
                  className="rounded-4 position-relative overflow-hidden p-4 d-flex align-items-center justify-content-center"
                  style={{ 
                    height: '380px', 
                    background: '#290d10', 
                    border: '1.5px solid #63262c',
                    backgroundImage: 'radial-gradient(#4d191f 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px'
                  }}
                >
                  <svg viewBox="0 0 1000 500" className="w-100 h-100 position-absolute inset-0" style={{ opacity: 0.22 }}>
                    <path fill="#F5EFE9" d="M150,120 Q200,80 300,110 T400,200 T250,300 Z M500,100 Q650,50 800,120 T850,250 T650,350 Z M750,320 Q850,300 900,380 Z" />
                  </svg>

                  {Object.keys(CITY_DATABASE).map((cityName) => {
                    const cityInfo = CITY_DATABASE[cityName];
                    const isSelected = selectedCity === cityName;
                    return (
                      <motion.div
                        key={cityName}
                        whileHover={{ scale: 1.15 }}
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
                          className="p-2 rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                          style={{ 
                            background: isSelected ? '#F5EFE9' : '#591D26', 
                            color: isSelected ? '#3e181c' : '#F5EFE9',
                            border: '2px solid #F5EFE9',
                            width: isSelected ? '44px' : '36px',
                            height: isSelected ? '44px' : '36px'
                          }}
                        >
                          <MapPin size={isSelected ? 22 : 18} />
                        </div>
                        <span 
                          className="badge rounded-pill mt-1.5 px-2.5 py-1"
                          style={{ 
                            background: isSelected ? '#F5EFE9' : '#1e090c', 
                            color: isSelected ? '#3e181c' : '#F5EFE9',
                            fontSize: '0.8rem',
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
              </div>
            </motion.div>
          )}

          {/* STEP 2: SIGHTS & SCENES SELECTION */}
          {wizardStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column gap-4"
            >
              <div className="p-4 rounded-4" style={{ background: '#3e181c', border: '1.5px solid #63262c' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="display-heading text-cream mb-1">Select Sights & Attractions in {selectedCity}</h4>
                    <small style={{ color: '#D8C8C3' }}>Choose what sights you want to visit during your {daysCount}-day stay.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ background: '#591D26', color: '#F5EFE9', fontSize: '0.85rem' }}>
                    {selectedAttractions.length} Selected
                  </span>
                </div>

                <div className="row g-4">
                  {cityData.attractions.map((attr) => {
                    const isSelected = selectedAttractions.includes(attr.id);
                    return (
                      <div key={attr.id} className="col-md-6">
                        <div 
                          onClick={() => toggleAttraction(attr.id)}
                          className="p-3 rounded-4 d-flex align-items-center justify-content-between gap-3 cursor-pointer"
                          style={{
                            background: isSelected ? '#4e1c22' : '#290d10',
                            border: isSelected ? '2px solid #F5EFE9' : '1.5px solid #63262c',
                            cursor: 'pointer'
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img src={attr.image} alt={attr.title} className="rounded-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge px-2.5 py-0.5 rounded-pill" style={{ background: '#591D26', color: '#F5EFE9', fontSize: '0.72rem' }}>
                                  {attr.category}
                                </span>
                                <span className="small text-cream d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                                  <Star size={13} fill="#F5EFE9" /> {attr.rating}
                                </span>
                              </div>
                              <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.15rem' }}>
                                {attr.title}
                              </h5>
                              <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>{attr.duration}</small>
                            </div>
                          </div>

                          <span 
                            className="badge rounded-circle p-2 d-flex align-items-center justify-content-center ms-2"
                            style={{ 
                              background: isSelected ? '#F5EFE9' : 'transparent', 
                              color: isSelected ? '#3e181c' : '#F5EFE9',
                              border: isSelected ? 'none' : '1.5px solid #63262c',
                              width: '34px',
                              height: '34px'
                            }}
                          >
                            {isSelected ? <Check size={18} /> : <Plus size={18} />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FAMOUS FOOD PLACES & HIGH IMPACT CTA CARD (MATCHING REFERENCE IMAGE) */}
          {wizardStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column gap-4"
            >
              {/* Food Places Grid */}
              <div className="p-4 rounded-4" style={{ background: '#3e181c', border: '1.5px solid #63262c' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="display-heading text-cream mb-1">Select Famous Food Places in {selectedCity}</h4>
                    <small style={{ color: '#D8C8C3' }}>Pick iconic cafes, bistros, and local dining spots.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ background: '#591D26', color: '#F5EFE9', fontSize: '0.85rem' }}>
                    {selectedFoodSpots.length} Selected
                  </span>
                </div>

                <div className="row g-4">
                  {cityData.foodSpots.map((food) => {
                    const isSelected = selectedFoodSpots.includes(food.id);
                    return (
                      <div key={food.id} className="col-md-6">
                        <div 
                          onClick={() => toggleFoodSpot(food.id)}
                          className="p-3 rounded-4 d-flex align-items-center justify-content-between gap-3 cursor-pointer"
                          style={{
                            background: isSelected ? '#4e1c22' : '#290d10',
                            border: isSelected ? '2px solid #F5EFE9' : '1.5px solid #63262c',
                            cursor: 'pointer'
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img src={food.image} alt={food.title} className="rounded-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge px-2.5 py-0.5 rounded-pill" style={{ background: '#290d10', color: '#F5EFE9', fontSize: '0.72rem' }}>
                                  {food.cuisine}
                                </span>
                                <span className="small text-cream fw-bold" style={{ fontSize: '0.8rem' }}>
                                  {food.price}
                                </span>
                              </div>
                              <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.15rem' }}>
                                {food.title}
                              </h5>
                              <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>★ {food.rating} Rating</small>
                            </div>
                          </div>

                          <span 
                            className="badge rounded-circle p-2 d-flex align-items-center justify-content-center ms-2"
                            style={{ 
                              background: isSelected ? '#F5EFE9' : 'transparent', 
                              color: isSelected ? '#3e181c' : '#F5EFE9',
                              border: isSelected ? 'none' : '1.5px solid #63262c',
                              width: '34px',
                              height: '34px'
                            }}
                          >
                            {isSelected ? <Check size={18} /> : <Plus size={18} />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HIGH-IMPACT SOLID MATTE CARD (MATCHING USER REFERENCE IMAGE WITH ZERO GLASSMORPHISM) */}
              <div 
                className="rounded-5 text-center p-5 position-relative overflow-hidden my-2"
                style={{
                  background: 'linear-gradient(180deg, #70262d 0%, #521c22 60%, #3e1418 100%)',
                  borderRadius: '36px',
                  border: '1.5px solid #7d2e35',
                  boxShadow: '0 24px 50px rgba(0, 0, 0, 0.45)',
                  padding: '4.5rem 3rem'
                }}
              >
                <h2 className="display-3 display-heading text-cream mb-3 mx-auto" style={{ fontSize: '3.1rem', maxWidth: '680px', lineHeight: 1.15 }}>
                  Never miss a moment <br /> on your journey again.
                </h2>
                <p className="lead mx-auto mb-4" style={{ color: '#e2d5c8', maxWidth: '580px', fontSize: '1.15rem', lineHeight: 1.65 }}>
                  Itinera organizes your sights, dining spots, rain checks, and multi-currency budgets automatically.
                </p>

                <div className="d-flex justify-content-center mb-4">
                  <button 
                    onClick={handleProceedToNextStep}
                    className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
                    style={{ padding: '0.9rem 2.5rem', background: '#f5efe9', color: '#3e181c', fontWeight: 700 }}
                  >
                    <span>Generate Itinerary Builder</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="small text-cream-muted" style={{ color: '#cbb8ac', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                  Instant setup &bull; Automated rain check &bull; Multi-currency budget split
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* FOOTER NAVIGATION CONTROLS */}
        <div className="d-flex align-items-center justify-content-between mt-4 pt-3 w-100">
          {wizardStep > 1 ? (
            <button 
              className="btn btn-pill-outline d-inline-flex align-items-center gap-2"
              onClick={() => setWizardStep(wizardStep - 1)}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {wizardStep < 3 && (
            <button 
              className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
              onClick={handleProceedToNextStep}
              style={{ padding: '0.85rem 2.2rem' }}
            >
              <span>Continue to Next Step</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
