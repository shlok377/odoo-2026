import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Compass, MapPin, Calendar, DollarSign, 
  Share2, CloudRain, Users, ShieldCheck, Sparkles, CheckCircle2, ChevronRight,
  Play, Pause, Film, Layers, Award, Clock, FileText, Smartphone
} from 'lucide-react';
import Globe3D from '../components/Globe3D';

export default function HomePage({ onNavigate }) {
  const [activeVideoChapter, setActiveVideoChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Video Chapter Data
  const videoChapters = [
    {
      id: 0,
      title: '01. Multi-City Itinerary Setup',
      desc: 'Pick your start & end dates, choose destinations from 10,000+ global cities, and define stop durations.',
      tag: 'Interactive Builder',
      previewImg: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 1,
      title: '02. Day-Wise Activity Builder',
      desc: 'Assign sightseeing, dining, and adventure activities with drag & drop time slot adjustments.',
      tag: 'Timeline Builder',
      previewImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 2,
      title: '03. Rain Check & Live Weather',
      desc: 'Receive real-time weather forecasts and rain check warnings for your planned outdoor dates.',
      tag: 'Weather Engine',
      previewImg: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 3,
      title: '04. Multi-Currency & PDF Export',
      desc: 'Instant FX conversion between USD, EUR, GBP, INR, JPY and one-click PDF schedule download.',
      tag: 'Financial Splitter',
      previewImg: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
  };

  return (
    <div className="w-100 overflow-hidden">
      
      {/* SECTION 1: HERO BANNER WITH PROMINENT LOGO & 3D GLOBE MASTERPIECE */}
      <section className="position-relative pt-5 pb-4 px-3 d-flex flex-column align-items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container"
          style={{ maxWidth: '950px', zIndex: 10 }}
        >
          {/* Prominent Large Logo */}
          <div className="d-inline-flex align-items-center justify-content-center mb-4">
            <img 
              src="/logo.png" 
              alt="Itinera Logo" 
              style={{ height: '95px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>

          {/* Headline & Tagline */}
          <h1 className="display-3 display-heading text-cream mb-3" style={{ fontSize: '3.4rem', lineHeight: 1.12 }}>
            Empowering Personalized <br />
            <span style={{ color: '#fcefe6', fontStyle: 'italic', fontWeight: 400 }}>Travel Planning</span>
          </h1>

          <p className="lead mx-auto mb-4" style={{ color: '#cbb8ac', maxWidth: '680px', fontSize: '1.15rem', lineHeight: 1.6 }}>
            Dream, design, and organize multi-city trips with ease. Interactive day-wise itineraries, automatic budget breakdowns, live rain checks, and multi-currency expense splitting.
          </p>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
            <button 
              onClick={() => onNavigate('planner-flow')} 
              className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
              style={{ width: 'auto', padding: '0.85rem 2.2rem' }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => onNavigate('planner-flow')} 
              className="btn btn-pill-outline hover-lift d-inline-flex align-items-center gap-2"
              style={{ width: 'auto', padding: '0.85rem 2rem' }}
            >
              <span>Explore Destination Map</span>
              <Compass size={18} />
            </button>
          </div>
        </motion.div>

        {/* Masterpiece 3D Globe Container */}
        <div className="w-100 position-relative my-2" style={{ zIndex: 5, minHeight: '560px' }}>
          <Globe3D />
        </div>

      </section>


      {/* SECTION 2: CONNECTED TIMELINE TUTORIAL SECTION (SOLID MATTE #120608) */}
      <section className="py-5 px-3" style={{ background: '#120608', borderTop: '1px solid #2a0d10', borderBottom: '1px solid #2a0d10' }}>
        <div className="container py-4">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-5"
          >
            <span className="badge rounded-pill mb-2 px-3 py-2" style={{ background: '#3b1417', border: '1px solid #572227', color: '#f5efe9', fontSize: '0.85rem' }}>
              Interactive Experience
            </span>
            <h2 className="display-4 display-heading text-cream" style={{ fontSize: '2.6rem' }}>
              How Itinera Simplifies Travel
            </h2>
            <p className="small text-cream-muted mx-auto" style={{ maxWidth: '560px', color: '#cbb8ac' }}>
              A connected 4-stage pipeline taking you from destination discovery to a finished travel itinerary.
            </p>
          </motion.div>

          {/* 4 Interactive Cards (SOLID MATTE SURFACES) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="row g-4"
          >
            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div 
                className="p-4 rounded-4 h-100 hover-lift d-flex flex-column justify-content-between"
                style={{ background: '#1e090c', border: '1.5px solid #3d1418', boxShadow: '0 12px 24px rgba(0,0,0,0.35)' }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="px-3 py-1 rounded-pill" style={{ background: '#532328', color: '#f5efe9', fontSize: '0.82rem', fontWeight: 700 }}>
                      STAGE 01
                    </div>
                    <MapPin size={22} style={{ color: '#f5efe9' }} />
                  </div>
                  <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.25rem' }}>Discover & Filter</h5>
                  <p className="small mb-3" style={{ color: '#cbb8ac', lineHeight: 1.5, fontSize: '0.88rem' }}>
                    Browse 10,000+ cities with popularity ratings, region filters, and estimated daily cost indexes.
                  </p>
                </div>

                <div className="p-2.5 rounded-3 mt-2 d-flex align-items-center justify-content-between" style={{ background: '#2d0e12', border: '1px solid #4a171c' }}>
                  <span className="small text-cream fw-semibold" style={{ fontSize: '0.78rem' }}>Paris &bull; $140/day</span>
                  <span className="badge rounded-pill" style={{ background: '#532328', color: '#f5efe9', fontSize: '0.7rem' }}>+ Add Stop</span>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div 
                className="p-4 rounded-4 h-100 hover-lift d-flex flex-column justify-content-between"
                style={{ background: '#1e090c', border: '1.5px solid #3d1418', boxShadow: '0 12px 24px rgba(0,0,0,0.35)' }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="px-3 py-1 rounded-pill" style={{ background: '#532328', color: '#f5efe9', fontSize: '0.82rem', fontWeight: 700 }}>
                      STAGE 02
                    </div>
                    <Calendar size={22} style={{ color: '#f5efe9' }} />
                  </div>
                  <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.25rem' }}>Day-Wise Builder</h5>
                  <p className="small mb-3" style={{ color: '#cbb8ac', lineHeight: 1.5, fontSize: '0.88rem' }}>
                    Schedule sightseeing, meals, and transport with interactive drag & drop timeline ordering.
                  </p>
                </div>

                <div className="p-2.5 rounded-3 mt-2 d-flex align-items-center justify-content-between" style={{ background: '#2d0e12', border: '1px solid #4a171c' }}>
                  <span className="small text-cream fw-semibold" style={{ fontSize: '0.78rem' }}>Day 1: Louvre Tour</span>
                  <span className="badge rounded-pill" style={{ background: '#532328', color: '#f5efe9', fontSize: '0.7rem' }}>2.5 Hrs</span>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div 
                className="p-4 rounded-4 h-100 hover-lift d-flex flex-column justify-content-between"
                style={{ background: '#1e090c', border: '1.5px solid #3d1418', boxShadow: '0 12px 24px rgba(0,0,0,0.35)' }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="px-3 py-1 rounded-pill" style={{ background: '#532328', color: '#f5efe9', fontSize: '0.82rem', fontWeight: 700 }}>
                      STAGE 03
                    </div>
                    <CloudRain size={22} style={{ color: '#f5efe9' }} />
                  </div>
                  <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.25rem' }}>Rain Check & FX</h5>
                  <p className="small mb-3" style={{ color: '#cbb8ac', lineHeight: 1.5, fontSize: '0.88rem' }}>
                    Automated weather forecasts for outdoor dates and live multi-currency expense conversions.
                  </p>
                </div>

                <div className="p-2.5 rounded-3 mt-2 d-flex align-items-center justify-content-between" style={{ background: '#2d0e12', border: '1px solid #4a171c' }}>
                  <span className="small text-cream fw-semibold" style={{ fontSize: '0.78rem' }}>Weather: Clear 24°C</span>
                  <span className="badge rounded-pill" style={{ background: '#224833', color: '#a7f3d0', fontSize: '0.7rem' }}>Pass</span>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div 
                className="p-4 rounded-4 h-100 hover-lift d-flex flex-column justify-content-between"
                style={{ background: '#1e090c', border: '1.5px solid #3d1418', boxShadow: '0 12px 24px rgba(0,0,0,0.35)' }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="px-3 py-1 rounded-pill" style={{ background: '#532328', color: '#f5efe9', fontSize: '0.82rem', fontWeight: 700 }}>
                      STAGE 04
                    </div>
                    <Share2 size={22} style={{ color: '#f5efe9' }} />
                  </div>
                  <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.25rem' }}>Share & Export</h5>
                  <p className="small mb-3" style={{ color: '#cbb8ac', lineHeight: 1.5, fontSize: '0.88rem' }}>
                    Share public trip URLs with friends, split group contributions, and export clean PDF schedules.
                  </p>
                </div>

                <div className="p-2.5 rounded-3 mt-2 d-flex align-items-center justify-content-between" style={{ background: '#2d0e12', border: '1px solid #4a171c' }}>
                  <span className="small text-cream fw-semibold" style={{ fontSize: '0.78rem' }}>PDF Schedule ready</span>
                  <span className="badge rounded-pill" style={{ background: '#532328', color: '#f5efe9', fontSize: '0.7rem' }}>Export</span>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>


      {/* SECTION 3: MEANINGFULLY PLACED REFERENCE CTA CARD (SOLID MATTE GRADIENT, ZERO GLASSMORPHISM) */}
      <section className="py-5 px-3" style={{ background: '#0e0406', borderTop: '1px solid #2a0d10' }}>
        <div className="container py-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="rounded-5 text-center p-5 mx-auto position-relative overflow-hidden"
            style={{
              maxWidth: '920px',
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
              Itinera organizes your routes, weather rain checks, and multi-currency budgets automatically.
            </p>

            <div className="d-flex justify-content-center mb-4">
              <button 
                onClick={() => onNavigate('planner-flow')} 
                className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
                style={{ padding: '0.9rem 2.5rem', background: '#f5efe9', color: '#3e181c', fontWeight: 700 }}
              >
                <span>Get started free &rarr;</span>
              </button>
            </div>

            <div className="small text-cream-muted" style={{ color: '#cbb8ac', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              Instant setup &bull; Automated rain check &bull; Multi-currency budget split
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
