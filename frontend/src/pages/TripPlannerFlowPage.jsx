import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Star, Plus, Check, ArrowRight, ArrowLeft,
  Utensils, Camera, ChevronRight, Sparkles, Navigation, Globe, Sun, CheckCircle2, Compass, ShieldCheck, Zap,
  CloudRain, Wind, Droplets, ShieldAlert, Search
} from 'lucide-react';

const CITY_DATABASE = {
  Paris: {
    country: 'France',
    subtitle: 'The City of Light & Art',
    lat: 48.8566,
    lng: 2.3522,
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
    lat: 35.6762,
    lng: 139.6503,
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
    lat: 41.9028,
    lng: 12.4964,
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
    lat: 51.5074,
    lng: -0.1278,
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

  // Leaflet & Open-Meteo Weather state for Step 1
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const cityData = CITY_DATABASE[selectedCity] || CITY_DATABASE.Paris;

  const chosenAttractionsList = cityData.attractions.filter(a => selectedAttractions.includes(a.id));
  const chosenFoodSpotsList = cityData.foodSpots.filter(f => selectedFoodSpots.includes(f.id));

  // Fetch Open-Meteo Live Weather & Rain Data for Selected City
  const fetchOpenMeteoWeather = async (lat, lng) => {
    setIsLoadingWeather(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching Open-Meteo weather data:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    if (cityData) {
      fetchOpenMeteoWeather(cityData.lat, cityData.lng);
    }
  }, [selectedCity]);

  // Initialize Leaflet Map inside Step 1 Container
  useEffect(() => {
    if (wizardStep !== 1 || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [cityData.lat, cityData.lng],
        zoom: 4,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter Tile Layer
      const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = { map, tileLayer };
    }

    // Refresh markers & pan map to city
    const { map } = mapInstanceRef.current;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const createCustomIcon = (isSelected) => L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          background-color: ${isSelected ? '#efe2d3' : '#591d26'};
          border: 2px solid ${isSelected ? '#591d26' : '#efe2d3'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          cursor: pointer;
          transition: all 0.25s ease;
        ">
          <div style="
            width: ${isSelected ? '12px' : '8px'};
            height: ${isSelected ? '12px' : '8px'};
            background-color: ${isSelected ? '#591d26' : '#efe2d3'};
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    Object.keys(CITY_DATABASE).forEach(cityName => {
      const info = CITY_DATABASE[cityName];
      const isSel = selectedCity === cityName;
      const marker = L.marker([info.lat, info.lng], { icon: createCustomIcon(isSel) })
        .addTo(map)
        .on('click', () => handleSelectCity(cityName));

      markersRef.current.push(marker);
    });

    map.flyTo([cityData.lat, cityData.lng], 5, {
      duration: 1.2,
      easeLinearity: 0.25
    });

  }, [wizardStep, selectedCity]);

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

  // Weather Assessment Helpers
  const currWeather = weatherData?.current;
  const dailyWeather = weatherData?.daily;
  const rainProb = dailyWeather?.precipitation_probability_max?.[0] ?? 0;
  const rainSum = dailyWeather?.precipitation_sum?.[0] ?? 0;
  const isRainWarning = rainProb >= 50 || (currWeather?.rain && currWeather.rain > 0) || rainSum > 1.0;

  return (
    <div className="w-100 min-vh-100 py-5 px-3 d-flex flex-column align-items-center" style={{ color: '#efe2d3', fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}>
      
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* STEPPER PROGRESS NAVIGATION HEADER */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-5 pb-3" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.18)' }}>
          <div>
            <span className="small display-heading" style={{ letterSpacing: '0.14em', color: '#d5c3b5', fontSize: '0.8rem' }}>
              TRIP BUILDER WIZARD
            </span>
            <h1 className="display-heading mb-0" style={{ fontSize: '2.2rem', color: '#efe2d3', lineHeight: 1.2 }}>
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
                  backgroundColor: wizardStep === st.num ? '#efe2d3' : 'transparent', 
                  color: wizardStep === st.num ? '#3e181c' : '#efe2d3',
                  border: wizardStep === st.num ? 'none' : '1px solid rgba(239, 226, 211, 0.25)',
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
          
          {/* STEP 1: DESTINATION & DAYS SELECTOR WITH INTERACTIVE LEAFLET MAP & OPEN-METEO WEATHER */}
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
              <div className="pb-4" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.15)' }}>
                <div className="row g-4 align-items-center">
                  <div className="col-md-6">
                    <label className="itinera-label mb-2" style={{ color: '#efe2d3' }}>Trip Title</label>
                    <input 
                      type="text"
                      className="itinera-input fw-bold w-100"
                      style={{ fontSize: '1.15rem', backgroundColor: '#1c0d10', color: '#efe2d3', border: '1px solid #4a2027' }}
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="itinera-label mb-2" style={{ color: '#efe2d3' }}>
                      Duration of Stay
                    </label>
                    
                    {/* ELEGANT WARM CREAM PILL COUNTER CONTROL */}
                    <div className="d-flex align-items-center">
                      <div 
                        className="d-inline-flex align-items-center justify-content-between px-2 py-1 rounded-pill"
                        style={{ 
                          backgroundColor: '#efe2d3', 
                          border: '1px solid #d5c3b5',
                          width: '230px',
                          height: '50px',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
                        }}
                      >
                        <motion.button 
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          type="button"
                          className="btn rounded-circle d-flex align-items-center justify-content-center p-0"
                          style={{ 
                            width: '36px', 
                            height: '36px', 
                            backgroundColor: '#3e181c', 
                            color: '#efe2d3', 
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            lineHeight: 1,
                            flexShrink: 0
                          }}
                          onClick={() => setDaysCount(prev => Math.max(1, prev - 1))}
                        >
                          &minus;
                        </motion.button>

                        <div className="d-flex align-items-center justify-content-center gap-1 flex-grow-1 px-1">
                          <input 
                            type="number" 
                            min="1"
                            max="30"
                            value={daysCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setDaysCount(Math.min(30, Math.max(1, val)));
                            }}
                            className="bg-transparent border-0 text-center p-0"
                            style={{ 
                              width: '35px', 
                              color: '#3e181c', 
                              fontSize: '1.25rem', 
                              outline: 'none', 
                              fontWeight: 800,
                              margin: 0
                            }}
                          />
                          <span className="fw-bold display-heading" style={{ fontSize: '1rem', color: '#3e181c' }}>
                            {daysCount === 1 ? 'Day' : 'Days'}
                          </span>
                        </div>

                        <motion.button 
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          type="button"
                          className="btn rounded-circle d-flex align-items-center justify-content-center p-0"
                          style={{ 
                            width: '36px', 
                            height: '36px', 
                            backgroundColor: '#3e181c', 
                            color: '#efe2d3', 
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            lineHeight: 1,
                            flexShrink: 0
                          }}
                          onClick={() => setDaysCount(prev => Math.min(30, prev + 1))}
                        >
                          &#43;
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* REAL INTERACTIVE LEAFLET MAP CONTAINER */}
              <div className="pt-2">
                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="display-heading text-cream mb-1" style={{ fontSize: '1.35rem' }}>Select Destination City</h4>
                    <small style={{ color: '#d5c3b5' }}>Click a location pin on the interactive map to set your destination.</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {Object.keys(CITY_DATABASE).map(cityName => (
                      <button
                        key={cityName}
                        type="button"
                        onClick={() => handleSelectCity(cityName)}
                        className="btn btn-sm rounded-pill px-3 py-1 fw-semibold"
                        style={{
                          backgroundColor: selectedCity === cityName ? '#efe2d3' : '#1c0d10',
                          color: selectedCity === cityName ? '#3e181c' : '#efe2d3',
                          border: '1px solid #4a2027',
                          fontSize: '0.8rem'
                        }}
                      >
                        {cityName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leaflet Map Box */}
                <div 
                  className="rounded-4 position-relative overflow-hidden shadow-lg mb-4"
                  style={{ 
                    height: '400px', 
                    backgroundColor: '#1c0d10', 
                    border: '1px solid #4a2027'
                  }}
                >
                  <div ref={mapContainerRef} className="w-100 h-100" style={{ zIndex: 1 }} />
                </div>

                {/* REAL-TIME OPEN-METEO WEATHER & LIVE RAIN CHECK WIDGET */}
                <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#2d0f14', border: '1px solid #4a2027' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <CloudRain size={20} style={{ color: isRainWarning ? '#d96b74' : '#efe2d3' }} />
                      <h5 className="fw-bold m-0" style={{ color: '#efe2d3', fontSize: '1.1rem' }}>
                        Live Weather & Rain Check for {selectedCity} (Open-Meteo)
                      </h5>
                    </div>
                    <span 
                      className="badge rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5"
                      style={{ 
                        backgroundColor: isRainWarning ? 'rgba(217, 107, 116, 0.2)' : 'rgba(19, 115, 51, 0.2)', 
                        color: isRainWarning ? '#fce4e6' : '#e6f4ea',
                        border: `1px solid ${isRainWarning ? '#d96b74' : '#137333'}`,
                        fontSize: '0.82rem'
                      }}
                    >
                      {isRainWarning ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
                      {isRainWarning ? 'Rain Check Warning 🌧️ (Pack Umbrella)' : 'No Rain Expected ☀️ (Optimal Conditions)'}
                    </span>
                  </div>

                  {isLoadingWeather ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-light" role="status" />
                      <span className="ms-2 small text-muted">Fetching live Open-Meteo weather metrics...</span>
                    </div>
                  ) : currWeather ? (
                    <div className="row g-3 text-cream">
                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: '#1c0d10', border: '1px solid rgba(239, 226, 211, 0.1)' }}>
                          <div className="small text-uppercase fw-semibold" style={{ color: '#d5c3b5', fontSize: '0.7rem' }}>TEMPERATURE</div>
                          <div className="fw-bold h4 m-0 mt-1" style={{ color: '#efe2d3' }}>
                            {Math.round(currWeather.temperature_2m)}°C
                          </div>
                          <div className="small" style={{ color: '#a89498', fontSize: '0.75rem' }}>
                            Feels {Math.round(currWeather.apparent_temperature)}°C
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: '#1c0d10', border: '1px solid rgba(239, 226, 211, 0.1)' }}>
                          <div className="small text-uppercase fw-semibold" style={{ color: '#d5c3b5', fontSize: '0.7rem' }}>RAIN PROBABILITY</div>
                          <div className="fw-bold h4 m-0 mt-1 d-flex align-items-center gap-1" style={{ color: isRainWarning ? '#d96b74' : '#efe2d3' }}>
                            <CloudRain size={16} /> {rainProb}%
                          </div>
                          <div className="small" style={{ color: '#a89498', fontSize: '0.75rem' }}>
                            Precip: {rainSum} mm
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: '#1c0d10', border: '1px solid rgba(239, 226, 211, 0.1)' }}>
                          <div className="small text-uppercase fw-semibold" style={{ color: '#d5c3b5', fontSize: '0.7rem' }}>HUMIDITY</div>
                          <div className="fw-bold h4 m-0 mt-1 d-flex align-items-center gap-1" style={{ color: '#efe2d3' }}>
                            <Droplets size={16} /> {currWeather.relative_humidity_2m}%
                          </div>
                          <div className="small" style={{ color: '#a89498', fontSize: '0.75rem' }}>Relative humidity</div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="p-3 rounded-3" style={{ backgroundColor: '#1c0d10', border: '1px solid rgba(239, 226, 211, 0.1)' }}>
                          <div className="small text-uppercase fw-semibold" style={{ color: '#d5c3b5', fontSize: '0.7rem' }}>WIND SPEED</div>
                          <div className="fw-bold h4 m-0 mt-1 d-flex align-items-center gap-1" style={{ color: '#efe2d3' }}>
                            <Wind size={16} /> {currWeather.wind_speed_10m} km/h
                          </div>
                          <div className="small" style={{ color: '#a89498', fontSize: '0.75rem' }}>Breeze speed</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Next Step Action Button */}
              <div className="d-flex justify-content-end pt-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="btn btn-pill-cream fw-bold py-3 px-5 d-flex align-items-center gap-2 hover-lift"
                  style={{ backgroundColor: '#efe2d3', color: '#3e181c', borderRadius: '9999px', fontSize: '1.02rem' }}
                >
                  <span>Continue to Sights & Food</span>
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SIGHTS & FOOD SELECTION */}
          {wizardStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column gap-4"
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <span className="badge rounded-pill px-3 py-1 mb-1" style={{ backgroundColor: '#1c0d10', color: '#efe2d3', border: '1px solid #4a2027' }}>
                    Destination: {selectedCity}, {cityData.country}
                  </span>
                  <h3 className="display-heading text-cream m-0" style={{ fontSize: '1.6rem' }}>
                    Select Sights & Culinary Experiences
                  </h3>
                </div>
                <button 
                  type="button" 
                  onClick={() => setWizardStep(1)}
                  className="btn btn-sm btn-outline-light rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                  style={{ borderColor: 'rgba(239, 226, 211, 0.3)', color: '#efe2d3' }}
                >
                  <ArrowLeft size={15} /> Back
                </button>
              </div>

              {/* Attractions Selection Grid */}
              <div>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#efe2d3' }}>
                  <Camera size={18} style={{ color: '#d5c3b5' }} /> Top Must-Visit Sights
                </h5>
                <div className="row g-3">
                  {cityData.attractions.map((attr) => {
                    const isSelected = selectedAttractions.includes(attr.id);
                    return (
                      <div key={attr.id} className="col-md-6">
                        <div 
                          onClick={() => toggleAttraction(attr.id)}
                          className="p-3 rounded-4 cursor-pointer d-flex gap-3 align-items-center hover-lift transition-all"
                          style={{ 
                            backgroundColor: isSelected ? '#efe2d3' : '#1c0d10', 
                            color: isSelected ? '#3e181c' : '#efe2d3',
                            border: isSelected ? '2px solid #efe2d3' : '1px solid #4a2027',
                            cursor: 'pointer'
                          }}
                        >
                          <img 
                            src={attr.image} 
                            alt={attr.title} 
                            className="rounded-3 object-fit-cover"
                            style={{ width: '70px', height: '70px' }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="badge rounded-pill px-2 py-0.5" style={{ backgroundColor: isSelected ? '#3e181c' : '#591d26', color: '#efe2d3', fontSize: '0.68rem' }}>
                                {attr.category}
                              </span>
                              <span className="small fw-bold d-flex align-items-center gap-1" style={{ color: isSelected ? '#3e181c' : '#d96b74' }}>
                                <Star size={13} fill={isSelected ? '#3e181c' : '#d96b74'} /> {attr.rating}
                              </span>
                            </div>
                            <h6 className="fw-bold m-0 my-1" style={{ fontSize: '0.95rem' }}>{attr.title}</h6>
                            <small className="d-flex align-items-center gap-1" style={{ opacity: 0.8, fontSize: '0.78rem' }}>
                              <Clock size={13} /> {attr.duration}
                            </small>
                          </div>
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ 
                              width: '28px', 
                              height: '28px', 
                              backgroundColor: isSelected ? '#3e181c' : 'rgba(239, 226, 211, 0.1)', 
                              color: '#efe2d3' 
                            }}
                          >
                            {isSelected ? <Check size={16} /> : <Plus size={16} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Food Spots Selection Grid */}
              <div className="pt-2">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#efe2d3' }}>
                  <Utensils size={18} style={{ color: '#d5c3b5' }} /> Iconic Dining & Bistros
                </h5>
                <div className="row g-3">
                  {cityData.foodSpots.map((food) => {
                    const isSelected = selectedFoodSpots.includes(food.id);
                    return (
                      <div key={food.id} className="col-md-6">
                        <div 
                          onClick={() => toggleFoodSpot(food.id)}
                          className="p-3 rounded-4 cursor-pointer d-flex gap-3 align-items-center hover-lift transition-all"
                          style={{ 
                            backgroundColor: isSelected ? '#efe2d3' : '#1c0d10', 
                            color: isSelected ? '#3e181c' : '#efe2d3',
                            border: isSelected ? '2px solid #efe2d3' : '1px solid #4a2027',
                            cursor: 'pointer'
                          }}
                        >
                          <img 
                            src={food.image} 
                            alt={food.title} 
                            className="rounded-3 object-fit-cover"
                            style={{ width: '70px', height: '70px' }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="small fw-semibold" style={{ opacity: 0.8, fontSize: '0.75rem' }}>{food.cuisine}</span>
                              <span className="fw-bold small">{food.price}</span>
                            </div>
                            <h6 className="fw-bold m-0 my-1" style={{ fontSize: '0.95rem' }}>{food.title}</h6>
                            <small className="d-flex align-items-center gap-1" style={{ color: isSelected ? '#3e181c' : '#d96b74', fontSize: '0.78rem' }}>
                              <Star size={13} fill={isSelected ? '#3e181c' : '#d96b74'} /> {food.rating} rating
                            </small>
                          </div>
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ 
                              width: '28px', 
                              height: '28px', 
                              backgroundColor: isSelected ? '#3e181c' : 'rgba(239, 226, 211, 0.1)', 
                              color: '#efe2d3' 
                            }}
                          >
                            {isSelected ? <Check size={16} /> : <Plus size={16} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 Action Buttons */}
              <div className="d-flex justify-content-between pt-4">
                <button 
                  type="button" 
                  onClick={() => setWizardStep(1)}
                  className="btn btn-outline-light rounded-pill px-4 py-2.5 fw-semibold"
                  style={{ borderColor: 'rgba(239, 226, 211, 0.3)', color: '#efe2d3' }}
                >
                  Back to Destination
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="btn btn-pill-cream fw-bold py-3 px-5 d-flex align-items-center gap-2 hover-lift"
                  style={{ backgroundColor: '#efe2d3', color: '#3e181c', borderRadius: '9999px', fontSize: '1.02rem' }}
                >
                  <span>Review & Generate Itinerary</span>
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONFIRM & GENERATE ITINERARY */}
          {wizardStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column gap-4"
            >
              <div className="text-center py-2">
                <span className="badge rounded-pill px-3 py-1 mb-2" style={{ backgroundColor: '#1c0d10', color: '#efe2d3', border: '1px solid #4a2027' }}>
                  STEP 03: CONFIRMATION
                </span>
                <h2 className="display-heading text-cream mb-1" style={{ fontSize: '2rem' }}>Ready to Generate Your Trip</h2>
                <p className="small text-cream-muted" style={{ color: '#d5c3b5' }}>Review your choices before starting your custom day-by-day itinerary.</p>
              </div>

              <div className="p-4 rounded-4 shadow-lg" style={{ backgroundColor: '#1c0d10', border: '1px solid #4a2027' }}>
                <div className="row g-4 align-items-center">
                  <div className="col-md-5">
                    <img 
                      src={cityData.cover} 
                      alt={selectedCity} 
                      className="w-100 rounded-4 object-fit-cover shadow-sm"
                      style={{ height: '200px' }}
                    />
                  </div>
                  <div className="col-md-7">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <MapPin size={16} style={{ color: '#d96b74' }} />
                      <span className="small text-uppercase fw-bold" style={{ letterSpacing: '0.1em', color: '#d5c3b5' }}>{selectedCity}, {cityData.country}</span>
                    </div>
                    <h3 className="fw-bold text-cream mb-2" style={{ fontSize: '1.6rem' }}>{tripTitle}</h3>
                    <p className="small mb-3" style={{ color: '#d5c3b5' }}>{cityData.subtitle}</p>

                    <div className="d-flex gap-3 flex-wrap">
                      <div className="p-2.5 rounded-3 px-3" style={{ backgroundColor: '#2d0f14', border: '1px solid #4a2027' }}>
                        <div className="small text-muted" style={{ fontSize: '0.72rem' }}>DURATION</div>
                        <div className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>{daysCount} Days</div>
                      </div>

                      <div className="p-2.5 rounded-3 px-3" style={{ backgroundColor: '#2d0f14', border: '1px solid #4a2027' }}>
                        <div className="small text-muted" style={{ fontSize: '0.72rem' }}>SIGHTS SELECTED</div>
                        <div className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>{chosenAttractionsList.length} Places</div>
                      </div>

                      <div className="p-2.5 rounded-3 px-3" style={{ backgroundColor: '#2d0f14', border: '1px solid #4a2027' }}>
                        <div className="small text-muted" style={{ fontSize: '0.72rem' }}>DINING SPOTS</div>
                        <div className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>{chosenFoodSpotsList.length} Bistros</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Step Action Buttons */}
              <div className="d-flex justify-content-between pt-3">
                <button 
                  type="button" 
                  onClick={() => setWizardStep(2)}
                  className="btn btn-outline-light rounded-pill px-4 py-2.5 fw-semibold"
                  style={{ borderColor: 'rgba(239, 226, 211, 0.3)', color: '#efe2d3' }}
                >
                  Back to Edit
                </button>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleFinalSubmit}
                  className="btn btn-pill-cream fw-bold py-3.5 px-5 d-flex align-items-center gap-2.5 hover-lift shadow-lg"
                  style={{ backgroundColor: '#efe2d3', color: '#3e181c', borderRadius: '9999px', fontSize: '1.1rem' }}
                >
                  <Sparkles size={20} />
                  <span>Start Day-by-Day Itinerary Builder &rarr;</span>
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
