import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, DollarSign, CloudSun, Compass, ShieldCheck, MapPin, Star, ArrowUpRight, Filter, PieChart, BarChart2, Zap } from 'lucide-react';

const TIMEFRAME_METRICS = {
  '2025-2026': {
    totalSpend: '₹2,84,500',
    spendChange: '+12.4% vs last year',
    cities: '21 Cities',
    countries: 'Across 08 Countries',
    carbon: '1.42 Tons',
    duration: '5.8 Days',
    categories: [
      { cat: 'Flights & Transit', pct: '42%', amount: '₹1,19,490', color: '#efe2d3' },
      { cat: 'Lodging & Resorts', pct: '35%', amount: '₹99,575', color: '#d96b74' },
      { cat: 'Dining & Food', pct: '15%', amount: '₹42,675', color: '#e8cfc8' },
      { cat: 'Sightseeing & Tours', pct: '8%', amount: '₹22,760', color: '#a87e85' }
    ]
  },
  'Last 12 Months': {
    totalSpend: '₹1,95,200',
    spendChange: '+8.1% vs prev 12m',
    cities: '14 Cities',
    countries: 'Across 05 Countries',
    carbon: '0.98 Tons',
    duration: '6.2 Days',
    categories: [
      { cat: 'Flights & Transit', pct: '45%', amount: '₹87,840', color: '#efe2d3' },
      { cat: 'Lodging & Resorts', pct: '32%', amount: '₹62,464', color: '#d96b74' },
      { cat: 'Dining & Food', pct: '14%', amount: '₹27,328', color: '#e8cfc8' },
      { cat: 'Sightseeing & Tours', pct: '9%', amount: '₹17,568', color: '#a87e85' }
    ]
  },
  'All Time': {
    totalSpend: '₹4,52,000',
    spendChange: 'Lifetime Total',
    cities: '38 Cities',
    countries: 'Across 16 Countries',
    carbon: '2.85 Tons',
    duration: '5.5 Days',
    categories: [
      { cat: 'Flights & Transit', pct: '40%', amount: '₹1,80,800', color: '#efe2d3' },
      { cat: 'Lodging & Resorts', pct: '38%', amount: '₹1,71,760', color: '#d96b74' },
      { cat: 'Dining & Food', pct: '13%', amount: '₹58,760', color: '#e8cfc8' },
      { cat: 'Sightseeing & Tours', pct: '9%', amount: '₹40,680', color: '#a87e85' }
    ]
  }
};

export default function AnalyticsDashboardPage({ onNavigate, onStartItinerary }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('2025-2026');
  const metrics = TIMEFRAME_METRICS[selectedTimeframe] || TIMEFRAME_METRICS['2025-2026'];

  const handleDestinationClick = (destName) => {
    if (onStartItinerary) {
      onStartItinerary({ city: destName });
    } else if (onNavigate) {
      onNavigate('planner-flow');
    }
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#3d141a', 
        background: 'radial-gradient(ellipse at 50% -10%, #63222a 0%, #47171e 55%, #2a0c10 100%)', 
        color: '#f5efe9', 
        minHeight: '100vh', 
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
      }}
    >
      <main className="container py-5" style={{ maxWidth: '1220px' }}>
        
        {/* Spacious Hero Banner Header */}
        <div className="mb-5 pb-2">
          <div style={{ maxWidth: '680px' }}>
            <div className="text-uppercase fw-bold mb-2" style={{ color: '#ddc9c3', fontSize: '0.8rem', letterSpacing: '0.14em' }}>
              ANALYTICS & TRAVEL INSIGHTS
            </div>
            <h1 className="display-4 text-cream m-0 fw-bold mb-3" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#efe2d3' }}>
              Smart metrics for smarter travels.
            </h1>
            <p className="m-0 text-cream-muted mb-4" style={{ color: '#cbb8b0', fontSize: '1.02rem', lineHeight: 1.5 }}>
              Track your travel spending, country exploration coverage, weather check history, and carbon footprint in real-time.
            </p>

            {/* Timeframe Filter Segmented Control */}
            <div className="d-inline-flex gap-2 p-1.5 rounded-pill" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
              {['2025-2026', 'Last 12 Months', 'All Time'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className="btn btn-sm rounded-pill px-3.5 py-1.5 transition-all fw-semibold"
                  style={{
                    backgroundColor: selectedTimeframe === tf ? '#efe2d3' : 'transparent',
                    color: selectedTimeframe === tf ? '#3b1417' : '#cbb8b0',
                    border: 'none',
                    fontSize: '0.84rem'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Dynamic KPI Cards Grid */}
        <div className="row g-4 mb-5">
          {/* Card 1: Highlighted Total Spend */}
          <div className="col-6 col-md-3">
            <div className="p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: '#efe2d3', color: '#3e181c', border: '1px solid #dfd2c9' }}>
              <div className="text-uppercase fw-bold small mb-2" style={{ color: '#591d26', letterSpacing: '0.1em', fontSize: '0.72rem' }}>TOTAL SPEND</div>
              <div className="fw-bold my-1" style={{ color: '#3e181c', fontSize: '2.1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{metrics.totalSpend}</div>
              <div className="small d-flex align-items-center gap-1 fw-bold mt-2" style={{ color: '#137333', fontSize: '0.8rem' }}>
                <ArrowUpRight size={14} /> {metrics.spendChange}
              </div>
            </div>
          </div>

          {/* Card 2: Cities Visited */}
          <div className="col-6 col-md-3">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#48171f', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
              <div className="text-uppercase fw-bold small mb-2" style={{ color: '#cbb8b0', letterSpacing: '0.1em', fontSize: '0.72rem' }}>CITIES VISITED</div>
              <div className="fw-bold text-cream my-1" style={{ color: '#efe2d3', fontSize: '2.1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{metrics.cities}</div>
              <div className="small mt-2" style={{ color: '#cbb8b0', fontSize: '0.8rem' }}>{metrics.countries}</div>
            </div>
          </div>

          {/* Card 3: Carbon Offset */}
          <div className="col-6 col-md-3">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#48171f', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
              <div className="text-uppercase fw-bold small mb-2" style={{ color: '#cbb8b0', letterSpacing: '0.1em', fontSize: '0.72rem' }}>CARBON OFFSET</div>
              <div className="fw-bold text-cream my-1" style={{ color: '#efe2d3', fontSize: '2.1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{metrics.carbon}</div>
              <div className="small mt-2" style={{ color: '#cbb8b0', fontSize: '0.8rem' }}>100% Eco-certified</div>
            </div>
          </div>

          {/* Card 4: Avg Trip Duration */}
          <div className="col-6 col-md-3">
            <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#48171f', border: '1px solid rgba(223, 210, 201, 0.15)' }}>
              <div className="text-uppercase fw-bold small mb-2" style={{ color: '#cbb8b0', letterSpacing: '0.1em', fontSize: '0.72rem' }}>AVG TRIP DURATION</div>
              <div className="fw-bold text-cream my-1" style={{ color: '#efe2d3', fontSize: '2.1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{metrics.duration}</div>
              <div className="small mt-2" style={{ color: '#cbb8b0', fontSize: '0.8rem' }}>Optimal travel pace</div>
            </div>
          </div>
        </div>

        {/* SECTION: TRENDING DESTINATIONS CAROUSEL */}
        <div className="mb-5 pb-2">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
              <div className="text-uppercase fw-bold small mb-1" style={{ color: '#cbb8b0', letterSpacing: '0.12em', fontSize: '0.72rem' }}>COMMUNITY HIGHLIGHTS</div>
              <h2 className="text-cream m-0 fw-bold" style={{ color: '#efe2d3', fontSize: '1.8rem' }}>Trending Destinations</h2>
            </div>
            <button onClick={() => onNavigate('planner-flow')} className="btn btn-sm text-cream rounded-pill px-3.5 py-1.5 fw-semibold" style={{ border: '1px solid rgba(223, 210, 201, 0.25)', backgroundColor: 'rgba(255,255,255,0.03)', fontSize: '0.84rem' }}>
              Explore all &rarr;
            </button>
          </div>

          <div className="d-flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { name: 'Paris', country: 'France', rating: '4.9', trips: '1,420 trips', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80' },
              { name: 'Bali', country: 'Indonesia', rating: '4.85', trips: '980 trips', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80' },
              { name: 'Tokyo', country: 'Japan', rating: '4.95', trips: '2,100 trips', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80' },
              { name: 'Dubai', country: 'UAE', rating: '4.8', trips: '1,150 trips', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80' },
              { name: 'Singapore', country: 'Singapore', rating: '4.9', trips: '1,800 trips', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80' }
            ].map((d, i) => (
              <div 
                key={i} 
                onClick={() => handleDestinationClick(d.name)}
                className="rounded-4 overflow-hidden flex-shrink-0 text-cream shadow-sm hover-lift cursor-pointer"
                style={{ width: '275px', backgroundColor: '#48171f', border: '1px solid rgba(223, 210, 201, 0.15)', cursor: 'pointer' }}
              >
                <div 
                  style={{ 
                    height: '165px', 
                    backgroundImage: `url(${d.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
                <div className="p-3.5 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-uppercase fw-bold" style={{ color: '#cbb8b0', fontSize: '0.68rem', letterSpacing: '0.08em' }}>{d.country}</span>
                    <span className="small fw-bold d-flex align-items-center gap-1" style={{ color: '#d96b74' }}>
                      <Star size={13} fill="#d96b74" /> {d.rating}
                    </span>
                  </div>
                  <h4 className="fw-bold text-cream m-0 my-1" style={{ color: '#efe2d3', fontSize: '1.15rem' }}>{d.name}</h4>
                  <div className="small mt-1 d-flex justify-content-between align-items-center" style={{ color: '#cbb8b0', fontSize: '0.8rem' }}>
                    <span>{d.trips} planned</span>
                    <span style={{ color: '#efe2d3', fontSize: '0.78rem' }}>Plan trip &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: SPENDING BREAKDOWN & CATEGORY SPLIT */}
        <div className="row g-4 mb-5">
          {/* Spend Category Split */}
          <div className="col-md-6">
            <div className="p-4 p-lg-4.5 rounded-4 h-100" style={{ backgroundColor: '#48171f', border: '1px solid rgba(223, 210, 201, 0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-cream m-0" style={{ color: '#efe2d3', fontSize: '1.3rem' }}>Category Expense Split</h3>
                <PieChart size={18} style={{ color: '#ddc9c3' }} />
              </div>
              <div className="d-flex flex-column gap-3.5 gap-3 mt-2">
                {metrics.categories.map((c, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between small text-cream mb-1.5" style={{ fontSize: '0.86rem' }}>
                      <span style={{ color: '#efe2d3', fontWeight: 500 }}>{c.cat}</span>
                      <strong style={{ color: c.color }}>{c.pct} ({c.amount})</strong>
                    </div>
                    <div className="w-100 rounded-pill overflow-hidden" style={{ height: '6px', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                      <div className="h-100 rounded-pill" style={{ width: c.pct, backgroundColor: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Travel Insights Card */}
          <div className="col-md-6">
            <div className="p-4 p-lg-4.5 rounded-4 h-100" style={{ backgroundColor: '#48171f', border: '1px solid rgba(223, 210, 201, 0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-cream m-0" style={{ color: '#efe2d3', fontSize: '1.3rem' }}>AI Travel Insights</h3>
                <Zap size={18} style={{ color: '#d96b74' }} />
              </div>
              <div className="d-flex flex-column gap-3">
                <div className="p-3.5 p-3 rounded-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.22)', borderLeft: '4px solid #d96b74', borderTop: '1px solid rgba(223, 210, 201, 0.12)', borderRight: '1px solid rgba(223, 210, 201, 0.12)', borderBottom: '1px solid rgba(223, 210, 201, 0.12)' }}>
                  <div className="fw-bold text-cream mb-1 d-flex align-items-center gap-2" style={{ color: '#efe2d3', fontSize: '0.94rem' }}>
                    <span>💡</span> Best Booking Window
                  </div>
                  <div className="small" style={{ color: '#cbb8b0', lineHeight: 1.5, fontSize: '0.85rem' }}>
                    Flight prices for your saved European trips drop by 18% when booked between October 10 – October 25.
                  </div>
                </div>

                <div className="p-3.5 p-3 rounded-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.22)', borderLeft: '4px solid #efe2d3', borderTop: '1px solid rgba(223, 210, 201, 0.12)', borderRight: '1px solid rgba(223, 210, 201, 0.12)', borderBottom: '1px solid rgba(223, 210, 201, 0.12)' }}>
                  <div className="fw-bold text-cream mb-1 d-flex align-items-center gap-2" style={{ color: '#efe2d3', fontSize: '0.94rem' }}>
                    <span>☀️</span> Optimal Weather Guarantee
                  </div>
                  <div className="small" style={{ color: '#cbb8b0', lineHeight: 1.5, fontSize: '0.85rem' }}>
                    94% of your historical travel dates had zero rain interruptions thanks to live Itinera Weather Checks.
                  </div>
                </div>

                <div className="p-3.5 p-3 rounded-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.22)', borderLeft: '4px solid #e8cfc8', borderTop: '1px solid rgba(223, 210, 201, 0.12)', borderRight: '1px solid rgba(223, 210, 201, 0.12)', borderBottom: '1px solid rgba(223, 210, 201, 0.12)' }}>
                  <div className="fw-bold text-cream mb-1 d-flex align-items-center gap-2" style={{ color: '#efe2d3', fontSize: '0.94rem' }}>
                    <span>💱</span> Multi-Currency Savings
                  </div>
                  <div className="small" style={{ color: '#cbb8b0', lineHeight: 1.5, fontSize: '0.85rem' }}>
                    Using co-branded travel cards saved you approx ₹8,400 in FX conversion fees during your Japan & UAE trips.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
