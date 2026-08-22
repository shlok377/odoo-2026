import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Star, Plus, Check, ArrowRight, ArrowLeft,
  Utensils, Camera, ChevronRight, Sparkles, Navigation, Globe, Sun, CheckCircle2, Compass, ShieldCheck
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

  const chosenAttractionsList = cityData.attractions.filter(a => selectedAttractions.includes(a.id));
  const chosenFoodSpotsList = cityData.foodSpots.filter(f => selectedFoodSpots.includes(f.id));

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

  const handleFinalSubmit = () => {
    const plannedTrip = {
      city: selectedCity,
      country: cityData.country,
      title: tripTitle,
      days: daysCount,
      attractions: chosenAttractionsList,
      foodSpots: chosenFoodSpotsList,
      cover: cityData.cover
    };

    if (onStartItinerary) {
      onStartItinerary(plannedTrip);
    } else {
      onNavigate('itinerary-builder');
    }
  };

  return (
    <div className="w-100 min-vh-100 py-5 px-3 d-flex flex-column align-items-center" style={{ color: '#F5EFE9' }}>
      
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* STEPPER PROGRESS NAVIGATION HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid rgba(245, 239, 233, 0.2)' }}>
          <div>
            <span className="small text-cream-muted display-heading" style={{ letterSpacing: '0.12em', color: '#D8C8C3', fontSize: '0.8rem' }}>
              TRIP BUILDER WIZARD
            </span>
            <h1 className="display-heading text-cream mb-0" style={{ fontSize: '2.2rem', lineHeight: 1.2 }}>
              Design Your Journey
            </h1>
          </div>

          {/* Clean Symmetrical Pill Indicators */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {[
              { num: 1, label: 'Destination & Days' },
              { num: 2, label: 'Sights & Food' },
              { num: 3, label: 'Confirm Trip' }
            ].map((st) => (
              <button 
                key={st.num}
                onClick={() => st.num <= wizardStep && setWizardStep(st.num)}
                className="btn btn-sm d-inline-flex align-items-center justify-content-center px-3.5 py-2 rounded-pill"
                style={{ 
                  backgroundColor: wizardStep === st.num ? '#F5EFE9' : '#271418', 
                  color: wizardStep === st.num ? '#3e181c' : '#F5EFE9',
                  border: wizardStep === st.num ? 'none' : '1px solid #4a2027',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: st.num <= wizardStep ? 'pointer' : 'default',
                  boxShadow: wizardStep === st.num ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                0{st.num}. {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* WIZARD CONTENT ANIMATION */}
        <AnimatePresence mode="wait">
          
          {/* STEP 1: DESTINATION & DAYS SELECTOR (VELVET MULBERRY CARDS #271418) */}
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
              <div 
                className="p-4 rounded-4" 
                style={{ 
                  backgroundColor: '#271418', 
                  border: '1px solid #4a2027', 
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)' 
                }}
              >
                <div className="row g-4 align-items-center">
                  <div className="col-md-6">
                    <label className="itinera-label text-cream mb-2">Trip Title</label>
                    <input 
                      type="text"
                      className="itinera-input fw-bold w-100"
                      style={{ fontSize: '1.15rem', backgroundColor: '#1c0d10', color: '#F5EFE9', border: '1px solid #4a2027' }}
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="itinera-label text-cream mb-2">Duration of Stay</label>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      {[3, 5, 7, 10, 14].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className="btn btn-sm flex-grow-1 text-nowrap"
                          style={{ 
                            fontSize: '0.88rem', 
                            fontWeight: daysCount === d ? 700 : 500,
                            padding: '0.65rem 0.9rem',
                            borderRadius: '9999px',
                            backgroundColor: daysCount === d ? '#F5EFE9' : '#1c0d10',
                            color: daysCount === d ? '#3e181c' : '#F5EFE9',
                            border: daysCount === d ? 'none' : '1px solid #4a2027',
                            boxShadow: daysCount === d ? '0 4px 14px rgba(0,0,0,0.3)' : 'none',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => setDaysCount(d)}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Interactive Map Container */}
              <div 
                className="p-4 rounded-4" 
                style={{ 
                  backgroundColor: '#271418', 
                  border: '1px solid #4a2027',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h4 className="display-heading text-cream mb-1" style={{ fontSize: '1.35rem' }}>Select Destination City</h4>
                    <small style={{ color: '#D8C8C3' }}>Click a location pin on the map to set your destination.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#1c0d10', color: '#F5EFE9', fontSize: '0.82rem', border: '1px solid #4a2027' }}>
                    Selected: {selectedCity}, {cityData.country}
                  </span>
                </div>

                <div 
                  className="rounded-4 position-relative overflow-hidden p-4 d-flex align-items-center justify-content-center"
                  style={{ 
                    height: '380px', 
                    backgroundColor: '#1c0d10', 
                    border: '1px solid #4a2027',
                    backgroundImage: 'radial-gradient(rgba(245, 239, 233, 0.12) 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px'
                  }}
                >
                  <svg viewBox="0 0 1000 500" className="w-100 h-100 position-absolute inset-0" style={{ opacity: 0.18 }}>
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
                            backgroundColor: isSelected ? '#F5EFE9' : '#6b262d', 
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
                            backgroundColor: isSelected ? '#F5EFE9' : '#1c0d10', 
                            color: isSelected ? '#3e181c' : '#F5EFE9',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            border: '1px solid #4a2027'
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

          {/* STEP 2: SIGHTS & FOOD SELECTION (VELVET MULBERRY CARDS #271418) */}
          {wizardStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column gap-4"
            >
              {/* Sights Selection */}
              <div 
                className="p-4 rounded-4" 
                style={{ 
                  backgroundColor: '#271418', 
                  border: '1px solid #4a2027',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="display-heading text-cream mb-1" style={{ fontSize: '1.35rem' }}>Select Sights & Attractions in {selectedCity}</h4>
                    <small style={{ color: '#D8C8C3' }}>Choose what sights you want to visit during your {daysCount}-day stay.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#1c0d10', color: '#F5EFE9', fontSize: '0.82rem', border: '1px solid #4a2027' }}>
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
                            backgroundColor: isSelected ? '#3a1b22' : '#1c0d10',
                            border: isSelected ? '2px solid #F5EFE9' : '1px solid #4a2027',
                            cursor: 'pointer'
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img src={attr.image} alt={attr.title} className="rounded-3" style={{ width: '75px', height: '75px', objectFit: 'cover' }} />
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge px-2.5 py-0.5 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#F5EFE9', fontSize: '0.72rem' }}>
                                  {attr.category}
                                </span>
                                <span className="small text-cream d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                                  <Star size={13} fill="#F5EFE9" /> {attr.rating}
                                </span>
                              </div>
                              <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.1rem' }}>
                                {attr.title}
                              </h5>
                              <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>{attr.duration}</small>
                            </div>
                          </div>

                          <span 
                            className="badge rounded-circle p-2 d-flex align-items-center justify-content-center ms-2"
                            style={{ 
                              backgroundColor: isSelected ? '#F5EFE9' : 'transparent', 
                              color: isSelected ? '#3e181c' : '#F5EFE9',
                              border: isSelected ? 'none' : '1px solid #4a2027',
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

              {/* Food Spots Selection */}
              <div 
                className="p-4 rounded-4" 
                style={{ 
                  backgroundColor: '#271418', 
                  border: '1px solid #4a2027',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="display-heading text-cream mb-1" style={{ fontSize: '1.35rem' }}>Select Famous Food Places in {selectedCity}</h4>
                    <small style={{ color: '#D8C8C3' }}>Pick iconic cafes, bistros, and local dining spots.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#1c0d10', color: '#F5EFE9', fontSize: '0.82rem', border: '1px solid #4a2027' }}>
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
                            backgroundColor: isSelected ? '#3a1b22' : '#1c0d10',
                            border: isSelected ? '2px solid #F5EFE9' : '1px solid #4a2027',
                            cursor: 'pointer'
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img src={food.image} alt={food.title} className="rounded-3" style={{ width: '75px', height: '75px', objectFit: 'cover' }} />
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge px-2.5 py-0.5 rounded-pill" style={{ backgroundColor: '#1c0d10', color: '#F5EFE9', fontSize: '0.72rem', border: '1px solid #4a2027' }}>
                                  {food.cuisine}
                                </span>
                                <span className="small text-cream fw-bold" style={{ fontSize: '0.8rem' }}>
                                  {food.price}
                                </span>
                              </div>
                              <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.1rem' }}>
                                {food.title}
                              </h5>
                              <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>★ {food.rating} Rating</small>
                            </div>
                          </div>

                          <span 
                            className="badge rounded-circle p-2 d-flex align-items-center justify-content-center ms-2"
                            style={{ 
                              backgroundColor: isSelected ? '#F5EFE9' : 'transparent', 
                              color: isSelected ? '#3e181c' : '#F5EFE9',
                              border: isSelected ? 'none' : '1px solid #4a2027',
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

          {/* STEP 3: ELEGANT TRIP PASSPORT & CONFIRMATION MASTER BOARD */}
          {wizardStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column gap-4 w-100"
            >
              {/* HERO TRIP PASSPORT BANNER */}
              <div 
                className="position-relative rounded-4 overflow-hidden p-4 p-md-5 d-flex flex-column justify-content-end"
                style={{ 
                  minHeight: '260px', 
                  backgroundImage: `linear-gradient(180deg, rgba(39, 20, 24, 0.4) 0%, rgba(28, 13, 16, 0.95) 100%), url(${cityData.cover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid #4a2027',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#F5EFE9', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    <Compass size={13} className="me-1" /> READY FOR GENERATION
                  </span>
                  <span className="badge px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#14291d', color: '#6ee7b7', border: '1px solid #6ee7b7', fontSize: '0.82rem' }}>
                    <Sun size={13} className="me-1" /> Rain Check: Sunny 24°C
                  </span>
                </div>

                <h1 className="display-4 display-heading text-cream mb-1" style={{ fontSize: '2.5rem' }}>
                  {tripTitle}
                </h1>
                <p className="small text-cream-muted mb-0" style={{ color: '#D8C8C3', fontSize: '1rem' }}>
                  {selectedCity}, {cityData.country} &bull; {daysCount} Days Stay &bull; {chosenAttractionsList.length} Sights &bull; {chosenFoodSpotsList.length} Dining Places
                </p>
              </div>

              {/* TWO COLUMN MASTER BOARD: INCLUDED HIGHLIGHTS & READINESS CHECKLIST */}
              <div className="row g-4">
                
                {/* Column 1: Included Attractions & Food Highlights */}
                <div className="col-md-7">
                  <div 
                    className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between"
                    style={{ backgroundColor: '#271418', border: '1px solid #4a2027', boxShadow: '0 16px 36px rgba(0,0,0,0.35)' }}
                  >
                    <div>
                      <h4 className="display-heading text-cream mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1.3rem' }}>
                        <Camera size={18} style={{ color: '#F5EFE9' }} />
                        Selected Sights & Experiences
                      </h4>

                      <div className="d-flex flex-column gap-2 mb-4">
                        {chosenAttractionsList.map(attr => (
                          <div key={attr.id} className="p-2.5 rounded-3 d-flex align-items-center gap-3" style={{ backgroundColor: '#1c0d10', border: '1px solid #4a2027' }}>
                            <img src={attr.image} alt={attr.title} className="rounded-2" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                            <div>
                              <div className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>{attr.title}</div>
                              <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>{attr.category} &bull; {attr.duration}</small>
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="display-heading text-cream mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1.3rem' }}>
                        <Utensils size={18} style={{ color: '#F5EFE9' }} />
                        Selected Dining Places
                      </h4>

                      <div className="d-flex flex-column gap-2">
                        {chosenFoodSpotsList.map(food => (
                          <div key={food.id} className="p-2.5 rounded-3 d-flex align-items-center gap-3" style={{ backgroundColor: '#1c0d10', border: '1px solid #4a2027' }}>
                            <img src={food.image} alt={food.title} className="rounded-2" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                            <div>
                              <div className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>{food.title}</div>
                              <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>{food.cuisine} &bull; {food.price}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Trip Readiness Checklist & Launch Trigger */}
                <div className="col-md-5">
                  <div 
                    className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between"
                    style={{ backgroundColor: '#271418', border: '1px solid #4a2027', boxShadow: '0 16px 36px rgba(0,0,0,0.35)' }}
                  >
                    <div>
                      <h4 className="display-heading text-cream mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1.3rem' }}>
                        <ShieldCheck size={18} style={{ color: '#F5EFE9' }} />
                        Trip Readiness Status
                      </h4>

                      <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                        {[
                          `Destination Locked: ${selectedCity}, ${cityData.country}`,
                          `Duration Configured: ${daysCount} Days`,
                          `Weather Sync: Rain Check Verified`,
                          `Budget Engine: Multi-Currency Split Active`,
                          `Interactive Schedule: ${chosenAttractionsList.length + chosenFoodSpotsList.length} Items Pre-loaded`
                        ].map((checkItem, idx) => (
                          <li key={idx} className="d-flex align-items-center gap-2.5 small text-cream" style={{ fontSize: '0.88rem' }}>
                            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                            <span>{checkItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-top border-secondary-subtle">
                      <button 
                        onClick={handleFinalSubmit}
                        className="btn btn-pill-cream hover-lift w-100 d-inline-flex align-items-center justify-content-center gap-2 py-3"
                        style={{ 
                          backgroundColor: '#F5EFE9', 
                          color: '#3e181c', 
                          fontWeight: 700, 
                          fontSize: '1.05rem', 
                          borderRadius: '9999px'
                        }}
                      >
                        <span>Generate Day-Wise Itinerary</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* FOOTER NAVIGATION CONTROLS */}
        <div className="d-flex align-items-center justify-content-between gap-3 mt-5 pt-3 w-100" style={{ borderTop: '1px solid rgba(245, 239, 233, 0.2)' }}>
          {wizardStep > 1 ? (
            <button 
              type="button"
              className="btn btn-pill-outline d-inline-flex align-items-center justify-content-center gap-2 text-nowrap"
              onClick={() => setWizardStep(wizardStep - 1)}
              style={{ borderRadius: '9999px', padding: '0.75rem 1.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {wizardStep < 3 && (
            <button 
              type="button"
              className="btn btn-pill-cream hover-lift d-inline-flex align-items-center justify-content-center gap-2 text-nowrap"
              onClick={() => setWizardStep(wizardStep + 1)}
              style={{ borderRadius: '9999px', padding: '0.75rem 2.2rem', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              <span>Continue to Final Review</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
