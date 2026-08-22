import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Star, Plus, Check, ArrowRight, ArrowLeft,
  Utensils, Camera, ChevronRight, Sparkles, Navigation, Globe, Sun, CheckCircle2, Compass, ShieldCheck, Zap, CloudRain
} from 'lucide-react';

const CITY_DATABASE = {
  Paris: {
    country: 'France',
    subtitle: 'The City of Light & Art',
    lat: 48.8566,
    lng: 2.3522,
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
    lat: 35.6762,
    lng: 139.6503,
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
    lat: 41.9028,
    lng: 12.4964,
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
    lat: 51.5074,
    lng: -0.1278,
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

function createDynamicCityData(cityName, countryName, lat, lng) {
  const cleanName = cityName || 'Destination';
  const cleanCountry = countryName || 'Global';
  return {
    country: cleanCountry,
    subtitle: `Explore famous sights & local dining of ${cleanName}`,
    lat: lat || 48.8566,
    lng: lng || 2.3522,
    mapCoords: { top: '50%', left: '50%' },
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    attractions: [
      {
        id: `${cleanName.toLowerCase()}_attr1`,
        title: `${cleanName} Historic Old Town & Heritage Walk`,
        category: 'Landmark',
        duration: '2.5 hrs',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: `${cleanName.toLowerCase()}_attr2`,
        title: `Grand ${cleanName} National Museum & Art Gallery`,
        category: 'Museum',
        duration: '3.0 hrs',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: `${cleanName.toLowerCase()}_attr3`,
        title: `${cleanName} Skyline Observatory & Viewpoint`,
        category: 'Experience',
        duration: '2.0 hrs',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: `${cleanName.toLowerCase()}_attr4`,
        title: `${cleanName} Botanical Gardens & Waterfront Park`,
        category: 'Nature',
        duration: '2.0 hrs',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
      }
    ],
    foodSpots: [
      {
        id: `${cleanName.toLowerCase()}_food1`,
        title: `The ${cleanName} Signature Local Bistro`,
        cuisine: 'Regional Specialities',
        price: '$$$',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: `${cleanName.toLowerCase()}_food2`,
        title: `${cleanName} Artisan Cafe & Bakery`,
        cuisine: 'Coffee & Patisserie',
        price: '$$',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: `${cleanName.toLowerCase()}_food3`,
        title: `${cleanName} Rooftop Grill & Fine Dining`,
        cuisine: 'Gourmet Dining',
        price: '$$$$',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
      }
    ]
  };
}

function TripPlannerInteractiveMap({ selectedCity, activeCityDatabase, onSelectCustomLocation, onSelectPresetCity }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [weatherData, setWeatherData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const currentCityObj = activeCityDatabase[selectedCity] || CITY_DATABASE[selectedCity] || createDynamicCityData(selectedCity, 'Global', 48.8566, 2.3522);

  // Fetch Open-Meteo Weather Data for Selected City coordinates
  useEffect(() => {
    if (!currentCityObj || !currentCityObj.lat || !currentCityObj.lng) return;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${currentCityObj.lat}&longitude=${currentCityObj.lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(err => console.error('Error fetching Open-Meteo weather:', err));
  }, [currentCityObj.lat, currentCityObj.lng, selectedCity]);

  // Leaflet Map Init & Map Click Listener
  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [currentCityObj.lat || 30, currentCityObj.lng || 15],
        zoom: 3,
        zoomControl: false
      });
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 18
      }).addTo(map);

      // Handle map click anywhere on earth!
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setIsGeocoding(true);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const addr = data.address || {};
          const name = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || addr.country || 'Custom Location';
          const country = addr.country || 'Global';

          onSelectCustomLocation({ name, country, lat, lng });
        } catch (err) {
          console.error('Reverse geocode error:', err);
          onSelectCustomLocation({ name: `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`, country: 'Worldwide', lat, lng });
        } finally {
          setIsGeocoding(false);
        }
      });

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers & Pan to Selected City
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Render active cities
    Object.keys(activeCityDatabase).forEach(cityName => {
      const city = activeCityDatabase[cityName];
      const isSelected = selectedCity === cityName;

      const customIcon = L.divIcon({
        className: 'city-picker-pin',
        html: `
          <div style="
            background-color: ${isSelected ? '#efe2d3' : '#591d26'};
            color: ${isSelected ? '#3b1417' : '#efe2d3'};
            border: 2px solid ${isSelected ? '#ffffff' : '#efe2d3'};
            border-radius: 9999px;
            padding: 6px 14px;
            font-size: 0.82rem;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 6px 18px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
          ">
            <span>📍</span>
            <span>${cityName}</span>
          </div>
        `,
        iconSize: [110, 34],
        iconAnchor: [55, 17]
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => onSelectPresetCity(cityName));

      markersRef.current.push(marker);

      if (isSelected) {
        map.flyTo([city.lat, city.lng], 6, { duration: 1.2 });
      }
    });
  }, [selectedCity, activeCityDatabase]);

  // Global Search Handler
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (resItem) => {
    const name = resItem.name;
    const country = resItem.country || resItem.admin1 || 'Global';
    const lat = resItem.latitude;
    const lng = resItem.longitude;
    setSearchQuery('');
    setSearchResults([]);
    onSelectCustomLocation({ name, country, lat, lng });
  };

  const rainProb = weatherData?.daily?.precipitation_probability_max?.[0] ?? 0;
  const temp = weatherData?.current?.temperature_2m;
  const isRainy = rainProb >= 50 || (weatherData?.current?.rain && weatherData.current.rain > 0);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Real-time Open-Meteo Weather Banner */}
      <div 
        className="p-3 rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-2 shadow-sm"
        style={{ 
          backgroundColor: isRainy ? 'rgba(217, 107, 116, 0.18)' : 'rgba(19, 115, 51, 0.18)', 
          border: `1.5px solid ${isRainy ? '#d96b74' : '#137333'}`
        }}
      >
        <div className="d-flex align-items-center gap-2.5">
          <CloudRain size={22} style={{ color: isRainy ? '#d96b74' : '#efe2d3' }} />
          <div>
            <div className="fw-bold small text-cream" style={{ color: '#efe2d3', fontSize: '0.92rem' }}>
              Live Weather in {selectedCity}: {temp !== undefined ? `${Math.round(temp)}°C` : 'Loading...'}
            </div>
            <div className="small" style={{ color: '#ddc9c3', fontSize: '0.78rem' }}>
              {isRainy ? `Rain Check Warning: ${rainProb}% precipitation probability — Pack waterproof gear!` : `Optimal Travel Conditions: ${rainProb}% rain probability — Clear skies!`}
            </div>
          </div>
        </div>
        <span className="badge rounded-pill px-3 py-1.5 fw-bold" style={{ backgroundColor: isRainy ? '#d96b74' : '#137333', color: '#ffffff', fontSize: '0.76rem' }}>
          {isRainy ? 'Rain Alert 🌧️' : 'Optimal Weather ☀️'}
        </span>
      </div>

      {/* Interactive Leaflet Map Box with Floating Search Bar */}
      <div className="rounded-4 overflow-hidden position-relative" style={{ height: '440px', border: '1.5px solid #4a2027', boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>
        
        {/* Floating Global Search Overlay */}
        <div className="position-absolute top-0 start-0 end-0 p-3" style={{ zIndex: 1000, pointerEvents: 'none' }}>
          <div className="position-relative" style={{ maxWidth: '450px', pointerEvents: 'auto' }}>
            <input 
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="🔍 Click map anywhere OR search any city/country..."
              className="form-control rounded-pill px-4 py-2.5 shadow-lg border-0"
              style={{ 
                backgroundColor: 'rgba(28, 13, 16, 0.92)', 
                backdropFilter: 'blur(12px)',
                color: '#efe2d3',
                fontSize: '0.88rem',
                border: '1px solid #4a2027'
              }}
            />
            {searchResults.length > 0 && (
              <div 
                className="position-absolute start-0 end-0 mt-2 rounded-4 overflow-hidden shadow-2xl"
                style={{ backgroundColor: '#1c0d10', border: '1px solid #4a2027', zIndex: 1001 }}
              >
                {searchResults.map((item) => (
                  <div
                    key={`${item.id}-${item.name}`}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-3 border-bottom border-dark cursor-pointer d-flex align-items-center justify-content-between hover-bg-dark"
                    style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                  >
                    <div>
                      <div className="fw-bold" style={{ color: '#efe2d3', fontSize: '0.88rem' }}>📍 {item.name}</div>
                      <small style={{ color: '#ddc9c3', fontSize: '0.76rem' }}>{item.admin1 ? `${item.admin1}, ` : ''}{item.country || ''}</small>
                    </div>
                    <span className="badge rounded-pill" style={{ backgroundColor: '#3b1417', color: '#efe2d3', fontSize: '0.72rem' }}>Select</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Canvas */}
        <div ref={mapRef} className="w-100 h-100" style={{ zIndex: 1 }} />

        {isGeocoding && (
          <div 
            className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill bg-dark text-cream small shadow"
            style={{ zIndex: 1000, backgroundColor: '#1c0d10', color: '#efe2d3', border: '1px solid #4a2027' }}
          >
            Locating spot... 📍
          </div>
        )}
      </div>

      {/* Quick Destination Pills */}
      <div className="d-flex flex-wrap gap-2 justify-content-center pt-1">
        {Object.keys(activeCityDatabase).map(cityName => (
          <button
            key={cityName}
            onClick={() => onSelectPresetCity(cityName)}
            className="btn btn-sm rounded-pill px-3.5 py-1.5 fw-semibold transition-all"
            style={{
              backgroundColor: selectedCity === cityName ? '#efe2d3' : '#1c0d10',
              color: selectedCity === cityName ? '#3b1417' : '#ddc9c3',
              border: selectedCity === cityName ? '1.5px solid #efe2d3' : '1px solid #4a2027',
              fontSize: '0.84rem'
            }}
          >
            📍 {cityName}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TripPlannerFlowPage({ onNavigate, onStartItinerary }) {
  const [wizardStep, setWizardStep] = useState(1);
  const [activeCityDatabase, setActiveCityDatabase] = useState(CITY_DATABASE);
  const [selectedCity, setSelectedCity] = useState('Paris');
  const [daysCount, setDaysCount] = useState(5);
  const [tripTitle, setTripTitle] = useState('Parisian Dream Getaway');
  const [selectedAttractions, setSelectedAttractions] = useState(['p1', 'p2']);
  const [selectedFoodSpots, setSelectedFoodSpots] = useState(['pf1']);

  const cityData = activeCityDatabase[selectedCity] || CITY_DATABASE.Paris;

  const chosenAttractionsList = (cityData.attractions || []).filter(a => selectedAttractions.includes(a.id));
  const chosenFoodSpotsList = (cityData.foodSpots || []).filter(f => selectedFoodSpots.includes(f.id));

  const handleSelectPresetCity = (cityName) => {
    setSelectedCity(cityName);
    setTripTitle(`${cityName} Travel Exploration`);
    const data = activeCityDatabase[cityName] || CITY_DATABASE[cityName];
    if (data && data.attractions && data.foodSpots) {
      setSelectedAttractions(data.attractions.slice(0, 2).map(a => a.id));
      setSelectedFoodSpots(data.foodSpots.slice(0, 1).map(f => f.id));
    }
  };

  const handleSelectCustomLocation = ({ name, country, lat, lng }) => {
    const existing = activeCityDatabase[name];
    if (existing) {
      handleSelectPresetCity(name);
      return;
    }

    const newCityData = createDynamicCityData(name, country, lat, lng);
    setActiveCityDatabase(prev => ({
      ...prev,
      [name]: newCityData
    }));

    setSelectedCity(name);
    setTripTitle(`${name} Travel Exploration`);
    setSelectedAttractions(newCityData.attractions.slice(0, 2).map(a => a.id));
    setSelectedFoodSpots(newCityData.foodSpots.slice(0, 1).map(f => f.id));
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
    <div className="w-100 min-vh-100 py-5 px-3 d-flex flex-column align-items-center" style={{ color: '#efe2d3' }}>
      
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

              {/* Clean Interactive Map Container */}
              <div className="pt-2">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h4 className="display-heading text-cream mb-1" style={{ fontSize: '1.35rem' }}>Select Destination City</h4>
                    <small style={{ color: '#d5c3b5' }}>Click a location pin on the map to set your destination.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#1c0d10', color: '#efe2d3', fontSize: '0.82rem', border: '1px solid #4a2027' }}>
                    Selected: {selectedCity}, {cityData.country}
                  </span>
                </div>

                <TripPlannerInteractiveMap 
                  selectedCity={selectedCity}
                  activeCityDatabase={activeCityDatabase}
                  onSelectCustomLocation={handleSelectCustomLocation}
                  onSelectPresetCity={handleSelectPresetCity}
                />
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
              {/* Sights Selection */}
              <div className="pb-4" style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.15)' }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="display-heading text-cream mb-1" style={{ fontSize: '1.35rem' }}>Select Sights & Attractions in {selectedCity}</h4>
                    <small style={{ color: '#d5c3b5' }}>Choose what sights you want to visit during your {daysCount}-day stay.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#1c0d10', color: '#efe2d3', fontSize: '0.82rem', border: '1px solid #4a2027' }}>
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
                          className="py-3 px-2 d-flex align-items-center justify-content-between gap-3 cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? 'rgba(239, 226, 211, 0.06)' : 'transparent',
                            borderBottom: isSelected ? '2px solid #efe2d3' : '1px solid rgba(239, 226, 211, 0.16)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img src={attr.image} alt={attr.title} className="rounded-3" style={{ width: '75px', height: '75px', objectFit: 'cover' }} />
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge px-2.5 py-0.5 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3', fontSize: '0.72rem' }}>
                                  {attr.category}
                                </span>
                                <span className="small text-cream d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                                  <Star size={13} fill="#efe2d3" /> {attr.rating}
                                </span>
                              </div>
                              <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.1rem' }}>
                                {attr.title}
                              </h5>
                              <small style={{ color: '#d5c3b5', fontSize: '0.78rem' }}>{attr.duration}</small>
                            </div>
                          </div>

                          <span 
                            className="badge rounded-circle p-2 d-flex align-items-center justify-content-center ms-2"
                            style={{ 
                              backgroundColor: isSelected ? '#efe2d3' : 'transparent', 
                              color: isSelected ? '#3e181c' : '#efe2d3',
                              border: isSelected ? 'none' : '1px solid rgba(239, 226, 211, 0.3)',
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
              <div className="pt-2">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="display-heading text-cream mb-1" style={{ fontSize: '1.35rem' }}>Select Famous Food Places in {selectedCity}</h4>
                    <small style={{ color: '#d5c3b5' }}>Pick iconic cafes, bistros, and local dining spots.</small>
                  </div>
                  <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: 'transparent', color: '#efe2d3', fontSize: '0.82rem', border: '1px solid rgba(239, 226, 211, 0.25)' }}>
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
                          className="py-3 px-2 d-flex align-items-center justify-content-between gap-3 cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? 'rgba(239, 226, 211, 0.06)' : 'transparent',
                            borderBottom: isSelected ? '2px solid #efe2d3' : '1px solid rgba(239, 226, 211, 0.16)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img src={food.image} alt={food.title} className="rounded-3" style={{ width: '75px', height: '75px', objectFit: 'cover' }} />
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge px-2.5 py-0.5 rounded-pill" style={{ backgroundColor: 'transparent', color: '#efe2d3', fontSize: '0.72rem', border: '1px solid rgba(239, 226, 211, 0.25)' }}>
                                  {food.cuisine}
                                </span>
                                <span className="small text-cream fw-bold" style={{ fontSize: '0.8rem' }}>
                                  {food.price}
                                </span>
                              </div>
                              <h5 className="display-heading text-cream mb-0" style={{ fontSize: '1.1rem' }}>
                                {food.title}
                              </h5>
                              <small style={{ color: '#d5c3b5', fontSize: '0.78rem' }}>★ {food.rating} Rating</small>
                            </div>
                          </div>

                          <span 
                            className="badge rounded-circle p-2 d-flex align-items-center justify-content-center ms-2"
                            style={{ 
                              backgroundColor: isSelected ? '#efe2d3' : 'transparent', 
                              color: isSelected ? '#3e181c' : '#efe2d3',
                              border: isSelected ? 'none' : '1px solid rgba(239, 226, 211, 0.3)',
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

              {/* Section 3: Community Shared Itineraries */}
              <div className="pt-4 border-top border-secondary-subtle">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <span className="small display-heading d-block mb-1" style={{ color: '#d5c3b5', letterSpacing: '0.12em', fontSize: '0.78rem' }}>
                      COMMUNITY SHOWCASE
                    </span>
                    <h4 className="display-heading text-cream mb-0" style={{ fontSize: '1.45rem' }}>
                      Publicly Shared Itineraries
                    </h4>
                    <small style={{ color: '#d5c3b5' }}>Explore or fork popular itineraries crafted by fellow travelers for {selectedCity}.</small>
                  </div>
                </div>

                <div className="row g-4">
                  {[
                    {
                      id: 'pub-1',
                      title: `7 Days Cyberpunk ${selectedCity} Exploration`,
                      author: '@sara_travels',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                      city: `${selectedCity}, ${cityData.country}`,
                      days: 7,
                      rating: 4.9,
                      cost: '₹ 85,000',
                      cover: cityData.cover
                    },
                    {
                      id: 'pub-2',
                      title: `5 Days ${selectedCity} Gastronomy & Culture`,
                      author: '@marco_eats',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                      city: `${selectedCity}, ${cityData.country}`,
                      days: 5,
                      rating: 4.8,
                      cost: '₹ 62,000',
                      cover: cityData.attractions[0]?.image || cityData.cover
                    },
                    {
                      id: 'pub-3',
                      title: `4 Days Romantic ${selectedCity} Walk`,
                      author: '@elena_p',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                      city: `${selectedCity}, ${cityData.country}`,
                      days: 4,
                      rating: 4.9,
                      cost: '₹ 54,000',
                      cover: cityData.foodSpots[0]?.image || cityData.cover
                    }
                  ].map((item) => (
                    <div key={item.id} className="col-md-4">
                      <motion.div 
                        whileHover={{ y: -4 }}
                        className="cursor-pointer d-flex flex-column h-100 pb-3"
                        style={{ borderBottom: '1px solid rgba(239, 226, 211, 0.18)' }}
                      >
                        <div className="position-relative mb-3 overflow-hidden rounded-4" style={{ height: '150px' }}>
                          <img src={item.cover} alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: 'rgba(28, 13, 16, 0.8)', color: '#efe2d3', fontSize: '0.75rem', border: '1px solid rgba(239, 226, 211, 0.25)' }}>
                              <Star size={11} fill="#efe2d3" className="me-1" /> {item.rating}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2 mb-2">
                          <img src={item.avatar} alt={item.author} className="rounded-circle" style={{ width: '22px', height: '22px', objectFit: 'cover' }} />
                          <span className="small" style={{ fontSize: '0.78rem', color: '#d5c3b5' }}>{item.author}</span>
                        </div>

                        <h6 className="display-heading text-cream mb-2" style={{ fontSize: '1.08rem', lineHeight: 1.3 }}>
                          {item.title}
                        </h6>

                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: 'transparent', border: '1px solid rgba(239, 226, 211, 0.25)', color: '#efe2d3', fontSize: '0.7rem' }}>
                            <MapPin size={10} className="me-1" /> {item.city}
                          </span>
                          <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3', fontSize: '0.7rem' }}>
                            {item.days} Days
                          </span>
                        </div>

                        <div className="pt-2 mt-auto border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                          <div>
                            <small className="d-block" style={{ fontSize: '0.68rem', color: '#d5c3b5' }}>ESTIMATED</small>
                            <span className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>{item.cost}</span>
                          </div>
                          <button 
                            className="btn btn-sm btn-pill-cream px-3 py-1" 
                            style={{ fontSize: '0.75rem', backgroundColor: '#efe2d3', color: '#3e181c' }}
                            onClick={() => alert(`Forked ${item.title} into your plan!`)}
                          >
                            Fork Trip
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DYNAMIC 3D-STYLE ITINERARY PREVIEW & LAUNCH BOARD (WOW & NOT BORING) */}
          {wizardStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="d-flex flex-column gap-5 w-100"
            >
              {/* HERO SPLIT ROW */}
              <div className="row g-4 align-items-center">
                
                {/* Left Header */}
                <div className="col-md-7">
                  <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={{ backgroundColor: 'rgba(239, 226, 211, 0.1)', border: '1px solid rgba(239, 226, 211, 0.25)' }}>
                    <Sparkles size={14} style={{ color: '#efe2d3' }} />
                    <span className="small fw-bold display-heading" style={{ color: '#efe2d3', letterSpacing: '0.08em', fontSize: '0.82rem' }}>
                      ITINERARY GENERATOR READY
                    </span>
                  </div>

                  <h1 className="display-3 display-heading mb-3" style={{ fontSize: '3rem', color: '#efe2d3', lineHeight: 1.1 }}>
                    Your {selectedCity} Journey is Configured.
                  </h1>

                  <p className="lead mb-4" style={{ color: '#d5c3b5', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Itinera has constructed your <strong style={{ color: '#efe2d3' }}>{daysCount}-Day {selectedCity} Journey</strong> with rain-check weather forecasts, custom budget allocations, and day-by-day sightseeing.
                  </p>

                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3', fontSize: '0.85rem' }}>
                      <MapPin size={12} className="me-1" /> {selectedCity}, {cityData.country}
                    </span>
                    <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.35)', fontSize: '0.85rem' }}>
                      <Sun size={12} className="me-1" /> Clear Sunny 24°C
                    </span>
                    <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#1c0d10', border: '1px solid #4a2027', color: '#efe2d3', fontSize: '0.85rem' }}>
                      <Calendar size={12} className="me-1" /> {daysCount} Days Stay
                    </span>
                  </div>
                </div>

                {/* Right Floating 3D Cover Photo */}
                <div className="col-md-5">
                  <motion.div 
                    whileHover={{ y: -8, rotate: 1 }}
                    transition={{ duration: 0.3 }}
                    className="position-relative overflow-hidden rounded-4 shadow-lg p-4 d-flex flex-column justify-content-end"
                    style={{ 
                      minHeight: '280px', 
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(28, 13, 16, 0.95) 100%), url(${cityData.cover})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1.5px solid #4a2027',
                      boxShadow: '0 24px 50px rgba(0,0,0,0.5)'
                    }}
                  >
                    <span className="badge px-3 py-1.5 rounded-pill position-absolute top-0 start-0 m-3" style={{ backgroundColor: 'rgba(28, 13, 16, 0.8)', border: '1px solid rgba(239, 226, 211, 0.3)', color: '#efe2d3', fontSize: '0.78rem' }}>
                      ● Live Weather Sync
                    </span>

                    <h3 className="display-heading text-cream mb-1" style={{ fontSize: '1.8rem' }}>
                      {tripTitle}
                    </h3>
                    <small style={{ color: '#d5c3b5' }}>{chosenAttractionsList.length} Sights &bull; {chosenFoodSpotsList.length} Dining Spots</small>
                  </motion.div>
                </div>

              </div>

              {/* DYNAMIC SNEAK-PEEK DAY CARDS PREVIEW */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="small display-heading" style={{ letterSpacing: '0.12em', color: '#d5c3b5', fontSize: '0.8rem' }}>
                    DAY-BY-DAY SNEAK PEEK TIMELINE
                  </span>
                  <span className="small text-cream-muted" style={{ color: '#d5c3b5', fontSize: '0.8rem' }}>
                    Showing first 3 days of your {daysCount}-day plan
                  </span>
                </div>

                <div className="row g-3">
                  {[
                    { day: 1, title: chosenAttractionsList[0]?.title || 'Arrival & Landmark Visit', tag: 'Sightseeing', time: '09:30 AM', image: chosenAttractionsList[0]?.image || cityData.cover },
                    { day: 2, title: chosenFoodSpotsList[0]?.title || 'Bistro Dining & Promenade', tag: 'Dining & Food', time: '01:00 PM', image: chosenFoodSpotsList[0]?.image || cityData.cover },
                    { day: 3, title: chosenAttractionsList[1]?.title || 'Museum Guided Walking Tour', tag: 'Art & Culture', time: '04:00 PM', image: chosenAttractionsList[1]?.image || cityData.cover }
                  ].map((preview) => (
                    <div key={preview.day} className="col-md-4">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="p-3 rounded-4 d-flex align-items-center gap-3"
                        style={{ backgroundColor: '#1c0d10', border: '1px solid #4a2027' }}
                      >
                        <img src={preview.image} alt={preview.title} className="rounded-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge px-2 py-0.5 rounded-pill" style={{ backgroundColor: '#6b262d', color: '#efe2d3', fontSize: '0.7rem' }}>
                              Day 0{preview.day}
                            </span>
                            <small style={{ color: '#d5c3b5', fontSize: '0.72rem' }}>{preview.time}</small>
                          </div>
                          <h6 className="display-heading text-cream mb-0 text-truncate" style={{ fontSize: '0.95rem', maxWidth: '170px' }}>
                            {preview.title}
                          </h6>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HIGH-IMPACT ANIMATED CTA BUTTON BAR */}
              <div className="pt-3 border-top border-secondary-subtle d-flex flex-column align-items-center">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinalSubmit}
                  className="btn btn-pill-cream hover-lift d-inline-flex align-items-center justify-content-center gap-3 px-5 py-3.5 shadow-lg"
                  style={{ 
                    backgroundColor: '#efe2d3', 
                    color: '#3e181c', 
                    fontWeight: 700, 
                    fontSize: '1.15rem', 
                    borderRadius: '9999px',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <Zap size={22} fill="#3e181c" />
                  <span>Generate Full Day-Wise Itinerary</span>
                  <ArrowRight size={22} />
                </motion.button>

                <div className="mt-3 text-cream-muted small text-center">
                  Instant setup &bull; Automated weather check &bull; Multi-currency budget split
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* FOOTER NAVIGATION CONTROLS */}
        <div className="d-flex align-items-center justify-content-between gap-3 mt-5 pt-3 w-100" style={{ borderTop: '1px solid rgba(239, 226, 211, 0.18)' }}>
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
              <span>
                {wizardStep === 1 ? 'Continue to Sights & Food' : 'Continue to Final Review'}
              </span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
