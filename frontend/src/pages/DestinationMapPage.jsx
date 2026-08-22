import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, CloudRain, Sun, Wind, Droplets, Compass, ArrowRight, ShieldAlert, CheckCircle2, Sparkles, Navigation, Layers } from 'lucide-react';

const PRESET_CITIES = [
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, category: 'Europe', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, category: 'Asia', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889, category: 'Asia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, category: 'Middle East', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80' },
  { id: 'newyork', name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, category: 'Americas', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80' },
  { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, category: 'Europe', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
  { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, category: 'Europe', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, category: 'Europe', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=400&q=80' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, category: 'Asia', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, category: 'Oceania', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80' },
  { id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, category: 'Europe', img: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=400&q=80' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, category: 'Asia', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' }
];

export default function DestinationMapPage({ onNavigate, onStartItinerary }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapStyle, setMapStyle] = useState('dark'); // 'dark' | 'voyager' | 'street'

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
    if (selectedCity) {
      fetchOpenMeteoWeather(selectedCity.lat, selectedCity.lng);
    }
  }, [selectedCity]);

  // Handle City Search via Open-Meteo Free Geocoding API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results.map(r => ({
            id: r.id,
            name: r.name,
            country: r.country || r.admin1 || '',
            lat: r.latitude,
            lng: r.longitude
          })));
        }
      } catch (err) {
        console.error('Geocoding search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2.5,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark theme map tiles (CartoDB Dark Matter)
      const tileUrl = mapStyle === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : mapStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = { map, tileLayer };
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when Map Style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map, tileLayer } = mapInstanceRef.current;
    map.removeLayer(tileLayer);

    const newTileUrl = mapStyle === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : mapStyle === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTileLayer = L.tileLayer(newTileUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    mapInstanceRef.current.tileLayer = newTileLayer;
  }, [mapStyle]);

  // Update Markers & Pan Map when City Selected
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const { map } = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom Glowing Burgundy Pin Marker Icon
    const createCustomIcon = (isSelected) => L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="
          width: ${isSelected ? '34px' : '26px'};
          height: ${isSelected ? '34px' : '26px'};
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
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    // Add Markers for Preset Cities
    PRESET_CITIES.forEach(city => {
      const isSel = selectedCity && selectedCity.name === city.name;
      const marker = L.marker([city.lat, city.lng], { icon: createCustomIcon(isSel) })
        .addTo(map)
        .on('click', () => setSelectedCity(city));

      markersRef.current.push(marker);
    });

    // Fly to Selected City Smoothly
    if (selectedCity) {
      map.flyTo([selectedCity.lat, selectedCity.lng], 6, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedCity]);

  // Helper for Weather Code Interpretation
  const getWeatherInfo = (code) => {
    if (code === 0) return { label: 'Clear Sky', icon: '☀️', color: '#137333', isRain: false };
    if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: '⛅', color: '#137333', isRain: false };
    if (code === 45 || code === 48) return { label: 'Foggy & Misty', icon: '🌫️', color: '#b06000', isRain: false };
    if (code >= 51 && code <= 57) return { label: 'Light Drizzle', icon: '🌦️', color: '#b06000', isRain: true };
    if (code >= 61 && code <= 67) return { label: 'Rainy', icon: '🌧️', color: '#d96b74', isRain: true };
    if (code >= 71 && code <= 77) return { label: 'Snowy', icon: '❄️', color: '#4285f4', isRain: false };
    if (code >= 80 && code <= 82) return { label: 'Rain Showers', icon: '🌧️', color: '#d96b74', isRain: true };
    if (code >= 95) return { label: 'Thunderstorm', icon: '🌩️', color: '#d96b74', isRain: true };
    return { label: 'Fair Weather', icon: '🌤️', color: '#137333', isRain: false };
  };

  const currWeather = weatherData?.current;
  const dailyWeather = weatherData?.daily;
  const weatherInfo = currWeather ? getWeatherInfo(currWeather.weather_code) : null;
  const rainProb = dailyWeather?.precipitation_probability_max?.[0] ?? 0;
  const rainSum = dailyWeather?.precipitation_sum?.[0] ?? 0;

  const isRainWarning = rainProb >= 50 || (currWeather?.rain && currWeather.rain > 0) || rainSum > 1.0;

  return (
    <div 
      className="d-flex flex-column min-vh-100 position-relative"
      style={{ 
        backgroundColor: '#3d141a', 
        background: 'linear-gradient(180deg, #591d26 0%, #42151c 100%)', 
        color: '#dfd2c9',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Header Banner */}
      <header className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ borderColor: 'rgba(223, 210, 201, 0.15)', backgroundColor: '#3b1417' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: '#591d26', border: '1px solid #7a2b34' }}>
            <Compass size={22} style={{ color: '#efe2d3' }} />
          </div>
          <div>
            <h1 className="h5 fw-bold m-0" style={{ color: '#efe2d3' }}>Interactive Destination Map & Live Rain Check</h1>
            <p className="small m-0 text-muted" style={{ color: '#ddc9c3', fontSize: '0.8rem' }}>Real-time Open-Meteo weather intelligence & global city exploration</p>
          </div>
        </div>

        {/* Map Layer Switcher */}
        <div className="d-flex align-items-center gap-2">
          <span className="small me-1 d-none d-sm-inline" style={{ color: '#cbb8b0', fontSize: '0.8rem' }}>Map Style:</span>
          {['dark', 'voyager', 'street'].map(style => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className="btn btn-sm rounded-pill px-3 py-1 text-capitalize fw-semibold"
              style={{
                backgroundColor: mapStyle === style ? '#efe2d3' : '#4e1a22',
                color: mapStyle === style ? '#3b1417' : '#ddc9c3',
                border: '1px solid rgba(223, 210, 201, 0.2)',
                fontSize: '0.78rem'
              }}
            >
              {style}
            </button>
          ))}
        </div>
      </header>

      {/* Main Map + Weather Panel Split */}
      <div className="flex-grow-1 d-flex flex-column flex-lg-row position-relative overflow-hidden" style={{ minHeight: 'calc(100vh - 75px)' }}>
        
        {/* Left Interactive Leaflet Map Canvas */}
        <div className="flex-grow-1 position-relative" style={{ minHeight: '450px' }}>
          <div ref={mapContainerRef} className="w-100 h-100" style={{ minHeight: '450px', zIndex: 1 }} />

          {/* Search Bar Overlay on Top Left of Map */}
          <div className="position-absolute top-0 start-0 m-3 z-3" style={{ width: 'clamp(280px, 80%, 360px)' }}>
            <div className="position-relative">
              <Search size={17} className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#efe2d3' }} />
              <input 
                type="text" 
                className="form-control rounded-pill ps-5 pe-4 py-2.5 shadow-lg"
                placeholder="Search any city worldwide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: '#3b1417',
                  border: '1.5px solid #80545b',
                  color: '#efe2d3',
                  fontSize: '0.9rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              />
            </div>

            {/* Geocoding Dropdown Suggestions */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-2 rounded-4 p-2 shadow-lg overflow-hidden position-absolute w-100" 
                  style={{ backgroundColor: '#3b1417', border: '1px solid #80545b', zIndex: 100 }}
                >
                  {searchResults.map((city, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedCity(city);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-2.5 rounded-3 d-flex align-items-center justify-content-between cursor-pointer hover-lift mb-1"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <MapPin size={15} style={{ color: '#d96b74' }} />
                        <span className="fw-bold small" style={{ color: '#efe2d3' }}>{city.name}</span>
                        <span className="small text-muted" style={{ color: '#cbb8b0', fontSize: '0.78rem' }}>{city.country}</span>
                      </div>
                      <ArrowRight size={13} style={{ color: '#efe2d3' }} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Preset City Chips at Map Bottom */}
          <div className="position-absolute bottom-0 start-0 m-3 z-3 d-none d-md-flex flex-wrap gap-2 overflow-x-auto" style={{ maxWidth: '70%' }}>
            {PRESET_CITIES.slice(0, 6).map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city)}
                className="btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 shadow-sm"
                style={{
                  backgroundColor: selectedCity?.name === city.name ? '#efe2d3' : 'rgba(59, 20, 23, 0.85)',
                  color: selectedCity?.name === city.name ? '#3b1417' : '#efe2d3',
                  border: '1px solid rgba(223, 210, 201, 0.2)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.8rem'
                }}
              >
                <MapPin size={13} /> {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Live Weather & City Details Intelligence Panel */}
        <div 
          className="p-4 flex-shrink-0 d-flex flex-column justify-content-between border-start overflow-y-auto scrollbar-thin" 
          style={{ 
            width: '100%', 
            maxWidth: '440px', 
            backgroundColor: '#3b1417', 
            borderColor: 'rgba(223, 210, 201, 0.15)',
            boxShadow: '-8px 0 30px rgba(0,0,0,0.3)'
          }}
        >
          {selectedCity && (
            <div>
              {/* City Hero Header Card */}
              <div className="rounded-4 overflow-hidden mb-4 position-relative shadow-sm" style={{ border: '1px solid #80545b' }}>
                <div 
                  style={{ 
                    height: '140px', 
                    backgroundImage: `url(${selectedCity.img || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
                <div className="p-3.5 p-3" style={{ backgroundColor: '#4e1a22' }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <span className="badge rounded-pill px-2.5 py-1 mb-1 text-uppercase" style={{ backgroundColor: '#591d26', color: '#efe2d3', fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                        {selectedCity.country || 'Global Destination'}
                      </span>
                      <h2 className="h3 fw-bold m-0" style={{ color: '#efe2d3' }}>{selectedCity.name}</h2>
                    </div>
                    <button 
                      onClick={() => onStartItinerary ? onStartItinerary({ destination: selectedCity.name }) : onNavigate('planner-flow')}
                      className="btn btn-sm rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5 hover-lift"
                      style={{ backgroundColor: '#efe2d3', color: '#3b1417', border: 'none', fontSize: '0.82rem' }}
                    >
                      Plan Trip <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* LIVE RAIN CHECK ASSESSMENT BADGE */}
              <div className="mb-4">
                <div className="text-uppercase fw-bold mb-2" style={{ color: '#ddc9c3', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
                  LIVE RAIN CHECK ASSESSMENT (OPEN-METEO)
                </div>

                <div 
                  className="p-3.5 p-3 rounded-4 d-flex align-items-center gap-3 shadow-sm"
                  style={{ 
                    backgroundColor: isRainWarning ? 'rgba(217, 107, 116, 0.18)' : 'rgba(19, 115, 51, 0.18)', 
                    border: `1.5px solid ${isRainWarning ? '#d96b74' : '#137333'}` 
                  }}
                >
                  <div 
                    className="p-2.5 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: isRainWarning ? '#d96b74' : '#137333', color: '#ffffff' }}
                  >
                    {isRainWarning ? <ShieldAlert size={22} /> : <CheckCircle2 size={22} />}
                  </div>

                  <div>
                    <div className="fw-bold mb-0.5" style={{ color: isRainWarning ? '#fce4e6' : '#e6f4ea', fontSize: '1rem' }}>
                      {isRainWarning ? 'Rain Check Alert 🌧️' : 'Optimal Travel Weather ☀️'}
                    </div>
                    <div className="small" style={{ color: '#ddc9c3', fontSize: '0.83rem', lineHeight: 1.4 }}>
                      {isRainWarning 
                        ? `High rain probability (${rainProb}%) detected. Carry an umbrella or plan indoor activities.`
                        : `No heavy rain expected (${rainProb}% risk). Perfect conditions for outdoor exploration.`}
                    </div>
                  </div>
                </div>
              </div>

              {/* REAL-TIME WEATHER METRICS GRID */}
              {isLoadingWeather ? (
                <div className="text-center py-5">
                  <div className="spinner-border spinner-border-sm text-light mb-2" role="status" />
                  <div className="small" style={{ color: '#cbb8b0' }}>Fetching Open-Meteo live weather data...</div>
                </div>
              ) : currWeather ? (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="text-uppercase fw-bold" style={{ color: '#ddc9c3', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
                      CURRENT CONDITIONS
                    </div>
                    <div className="small fw-semibold d-flex align-items-center gap-1" style={{ color: weatherInfo?.color || '#efe2d3' }}>
                      <span>{weatherInfo?.icon}</span> {weatherInfo?.label}
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Temperature */}
                    <div className="col-6">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#4e1a22', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
                        <div className="small text-uppercase fw-bold mb-1" style={{ color: '#cbb8b0', fontSize: '0.68rem' }}>TEMPERATURE</div>
                        <div className="fw-bold text-cream h3 m-0" style={{ color: '#efe2d3' }}>
                          {Math.round(currWeather.temperature_2m)}°C
                        </div>
                        <div className="small mt-1" style={{ color: '#ddc9c3', fontSize: '0.76rem' }}>
                          Feels like {Math.round(currWeather.apparent_temperature)}°C
                        </div>
                      </div>
                    </div>

                    {/* Rain Probability & Sum */}
                    <div className="col-6">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#4e1a22', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
                        <div className="small text-uppercase fw-bold mb-1" style={{ color: '#cbb8b0', fontSize: '0.68rem' }}>RAIN PROBABILITY</div>
                        <div className="fw-bold h3 m-0 d-flex align-items-center gap-1.5" style={{ color: isRainWarning ? '#d96b74' : '#efe2d3' }}>
                          <CloudRain size={20} /> {rainProb}%
                        </div>
                        <div className="small mt-1" style={{ color: '#ddc9c3', fontSize: '0.76rem' }}>
                          Precipitation: {rainSum} mm
                        </div>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="col-6">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#4e1a22', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
                        <div className="small text-uppercase fw-bold mb-1" style={{ color: '#cbb8b0', fontSize: '0.68rem' }}>HUMIDITY</div>
                        <div className="fw-bold text-cream h4 m-0 d-flex align-items-center gap-1.5" style={{ color: '#efe2d3' }}>
                          <Droplets size={18} /> {currWeather.relative_humidity_2m}%
                        </div>
                      </div>
                    </div>

                    {/* Wind Speed */}
                    <div className="col-6">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#4e1a22', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
                        <div className="small text-uppercase fw-bold mb-1" style={{ color: '#cbb8b0', fontSize: '0.68rem' }}>WIND SPEED</div>
                        <div className="fw-bold text-cream h4 m-0 d-flex align-items-center gap-1.5" style={{ color: '#efe2d3' }}>
                          <Wind size={18} /> {currWeather.wind_speed_10m} km/h
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* 7-DAY FORECAST PREVIEW */}
              {dailyWeather && (
                <div>
                  <div className="text-uppercase fw-bold mb-2" style={{ color: '#ddc9c3', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
                    7-DAY WEATHER FORECAST
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {dailyWeather.time?.slice(0, 5).map((dateStr, idx) => {
                      const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
                      const maxT = Math.round(dailyWeather.temperature_2m_max[idx]);
                      const minT = Math.round(dailyWeather.temperature_2m_min[idx]);
                      const prob = dailyWeather.precipitation_probability_max?.[idx] ?? 0;
                      const code = dailyWeather.weather_code[idx];
                      const info = getWeatherInfo(code);

                      return (
                        <div 
                          key={dateStr}
                          className="p-2.5 rounded-3 d-flex align-items-center justify-content-between small"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(223, 210, 201, 0.08)' }}
                        >
                          <div className="fw-bold" style={{ color: '#efe2d3', width: '60px' }}>{idx === 0 ? 'Today' : dayName}</div>
                          <div className="d-flex align-items-center gap-1.5">
                            <span>{info.icon}</span>
                            <span style={{ color: '#cbb8b0', fontSize: '0.8rem' }}>{info.label}</span>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <span className="small" style={{ color: prob >= 50 ? '#d96b74' : '#cbb8b0', fontSize: '0.78rem' }}>
                              💧 {prob}%
                            </span>
                            <span className="fw-bold" style={{ color: '#efe2d3', fontSize: '0.84rem' }}>
                              {maxT}° <span className="text-muted fw-normal" style={{ color: '#a89498' }}>{minT}°</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-top text-center small" style={{ borderColor: 'rgba(223, 210, 201, 0.12)', color: '#a89498', fontSize: '0.78rem' }}>
            Powered by Open-Meteo Weather API & Leaflet OpenStreetMap
          </div>
        </div>

      </div>
    </div>
  );
}
