import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, DollarSign, CloudSun, Compass, ShieldCheck, MapPin, Star, ArrowUpRight, Filter, PieChart, BarChart2, Zap } from 'lucide-react';

export default function AnalyticsDashboardPage({ onNavigate }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('2025-2026');

  return (
    <div style={{ backgroundColor: '#591d26', color: '#f5efe9', minHeight: '100vh', fontFamily: 'Neuton, serif' }}>
      
      <main className="container py-5" style={{ maxWidth: '1240px' }}>
        
        {/* Hero Banner Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-5">
          <div>
            <div className="text-uppercase fw-bold mb-2" style={{ color: '#e8cfc8', fontSize: '0.9rem', letterSpacing: '0.12em', fontFamily: 'Pangolin, cursive' }}>
              ANALYTICS & TRAVEL INSIGHTS
            </div>
            <h1 className="display-3 display-heading text-cream m-0" style={{ fontSize: 'clamp(2.8rem, 5vw, 5.5rem)', fontWeight: 600, lineHeight: 0.85 }}>
              Smart metrics for<br />smarter travels.
            </h1>
          </div>

          <div className="d-flex flex-column align-items-md-end gap-3">
            <p className="m-0 text-cream-muted" style={{ color: '#ddc9c3', maxWidth: '420px', fontSize: '1.05rem', lineHeight: 1.4 }}>
              Track your travel spending, country exploration coverage, weather check history, and carbon footprint in real-time.
            </p>
            <div className="d-flex gap-2">
              {['2025-2026', 'Last 12 Months', 'All Time'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 transition-all ${selectedTimeframe === tf ? 'bg-cream text-burgundy fw-bold' : 'text-cream border-cream-muted'}`}
                  style={{
                    backgroundColor: selectedTimeframe === tf ? '#f5efe9' : 'transparent',
                    color: selectedTimeframe === tf ? '#591d26' : '#ddc9c3',
                    border: selectedTimeframe === tf ? '1px solid #f5efe9' : '1px solid #80545b'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 KPI Cards Grid */}
        <div className="row g-3 mb-5">
          <div className="col-6 col-md-3">
            <div className="p-4 rounded-3 h-100 shadow-sm" style={{ backgroundColor: '#efe2d3', color: '#3e181c', border: '1px solid #dfd2c9' }}>
              <div className="text-uppercase fw-bold small" style={{ color: '#591d26', letterSpacing: '0.1em' }}>TOTAL SPEND</div>
              <div className="display-4 fw-bold display-heading my-2" style={{ color: '#3e181c', fontSize: '2.5rem', lineHeight: 1 }}>₹2,84,500</div>
              <div className="small d-flex align-items-center gap-1 fw-bold" style={{ color: '#137333' }}>
                <ArrowUpRight size={14} /> +12.4% vs last year
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
              <div className="text-uppercase fw-bold small" style={{ color: '#ddc9c3', letterSpacing: '0.1em' }}>CITIES VISITED</div>
              <div className="display-4 fw-bold display-heading text-cream my-2" style={{ fontSize: '2.5rem', lineHeight: 1 }}>21 Cities</div>
              <div className="small text-cream-muted" style={{ color: '#ddc9c3' }}>Across 08 Countries</div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
              <div className="text-uppercase fw-bold small" style={{ color: '#ddc9c3', letterSpacing: '0.1em' }}>CARBON OFFSET</div>
              <div className="display-4 fw-bold display-heading text-cream my-2" style={{ fontSize: '2.5rem', lineHeight: 1 }}>1.42 Tons</div>
              <div className="small text-cream-muted" style={{ color: '#ddc9c3' }}>100% Eco-certified</div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#48171f', border: '1px solid #80545b' }}>
              <div className="text-uppercase fw-bold small" style={{ color: '#ddc9c3', letterSpacing: '0.1em' }}>AVG TRIP DURATION</div>
              <div className="display-4 fw-bold display-heading text-cream my-2" style={{ fontSize: '2.5rem', lineHeight: 1 }}>5.8 Days</div>
              <div className="small text-cream-muted" style={{ color: '#ddc9c3' }}>Optimal travel pace</div>
            </div>
          </div>
        </div>

        {/* SECTION: TRENDING DESTINATIONS CAROUSEL */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
              <div className="text-uppercase fw-bold text-cream-muted small" style={{ color: '#ddc9c3', letterSpacing: '0.1em' }}>COMMUNITY HIGHLIGHTS</div>
              <h2 className="display-5 display-heading text-cream m-0" style={{ fontSize: '2.2rem' }}>Trending Destinations</h2>
            </div>
            <button onClick={() => onNavigate('planner-flow')} className="btn btn-sm text-cream fw-bold" style={{ border: '1px solid #80545b' }}>Explore all &rarr;</button>
          </div>

          <div className="d-flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
            {[
              { name: 'Paris', country: 'France', rating: '4.9', trips: '1,420 trips', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80' },
              { name: 'Bali', country: 'Indonesia', rating: '4.85', trips: '980 trips', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80' },
              { name: 'Tokyo', country: 'Japan', rating: '4.95', trips: '2,100 trips', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=80' },
              { name: 'Dubai', country: 'UAE', rating: '4.8', trips: '1,150 trips', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80' },
              { name: 'Singapore', country: 'Singapore', rating: '4.9', trips: '1,800 trips', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=700&q=80' }
            ].map((d, i) => (
              <div 
                key={i} 
                className="rounded-3 overflow-hidden flex-shrink-0 text-dark shadow-sm hover-lift"
                style={{ width: '270px', backgroundColor: '#fffaf5' }}
              >
                <div 
                  style={{ 
                    height: '160px', 
                    backgroundImage: `url(${d.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>{d.country}</span>
                    <span className="small fw-bold d-flex align-items-center gap-1" style={{ color: '#591d26' }}>
                      <Star size={14} fill="#591d26" /> {d.rating}
                    </span>
                  </div>
                  <h4 className="fw-bold m-0" style={{ color: '#171313' }}>{d.name}</h4>
                  <div className="small text-muted mt-2">{d.trips} planned</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: SPENDING BREAKDOWN & CATEGORY SPLIT */}
        <div className="row g-4 mb-5">
          {/* Spend Category Split */}
          <div className="col-md-6">
            <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#40141b', border: '1px solid #80545b' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold text-cream m-0">Category Expense Split</h3>
                <PieChart size={20} className="text-cream-muted" />
              </div>
              <div className="d-flex flex-column gap-3 mt-3">
                {[
                  { cat: 'Flights & Transit', pct: '42%', amount: '₹1,19,490', color: '#f5efe9' },
                  { cat: 'Lodging & Resorts', pct: '35%', amount: '₹99,575', color: '#d96b74' },
                  { cat: 'Dining & Food', pct: '15%', amount: '₹42,675', color: '#e8cfc8' },
                  { cat: 'Sightseeing & Tours', pct: '8%', amount: '₹22,760', color: '#80545b' }
                ].map((c, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between small text-cream mb-1">
                      <span>{c.cat}</span>
                      <strong style={{ color: c.color }}>{c.pct} ({c.amount})</strong>
                    </div>
                    <div className="w-100 rounded-pill overflow-hidden" style={{ height: '7px', backgroundColor: 'rgba(245,239,233,0.1)' }}>
                      <div className="h-100 rounded-pill" style={{ width: c.pct, backgroundColor: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Travel Insights Card */}
          <div className="col-md-6">
            <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#40141b', border: '1px solid #80545b' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold text-cream m-0">AI Travel Insights</h3>
                <Zap size={20} className="text-cream" />
              </div>
              <div className="d-flex flex-column gap-3">
                <div className="p-3 rounded-2" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                  <div className="fw-bold text-cream mb-1">💡 Best Booking Window</div>
                  <div className="small text-cream-muted" style={{ color: '#ddc9c3' }}>
                    Flight prices for your saved European trips drop by 18% when booked between October 10 – October 25.
                  </div>
                </div>

                <div className="p-3 rounded-2" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                  <div className="fw-bold text-cream mb-1">☀️ Optimal Weather Guarantee</div>
                  <div className="small text-cream-muted" style={{ color: '#ddc9c3' }}>
                    94% of your historical travel dates had zero rain interruptions thanks to live Itinera Weather Checks.
                  </div>
                </div>

                <div className="p-3 rounded-2" style={{ backgroundColor: '#591d26', border: '1px solid #80545b' }}>
                  <div className="fw-bold text-cream mb-1">💱 Multi-Currency Savings</div>
                  <div className="small text-cream-muted" style={{ color: '#ddc9c3' }}>
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
