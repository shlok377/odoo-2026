import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Compass, MapPin, Calendar, DollarSign, 
  Share2, CloudRain, Users, ShieldCheck, Sparkles, CheckCircle2, ChevronRight,
  Play, Pause, Film, Layers, Award, Clock, FileText, Smartphone, Sun, Utensils, Star, Check
} from 'lucide-react';
import Globe3D from '../components/Globe3D';

export default function HomePage({ onNavigate }) {
  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="w-100 overflow-hidden" style={{ color: '#F5EFE9' }}>
      
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


      {/* SECTION 2: THREE STEPS "HOW IT WORKS" (EXACT ESTRIA.AI REFERENCE DESIGN) */}
      <section className="py-5 px-3" style={{ background: '#120507', borderTop: '1px solid #2a0d10', borderBottom: '1px solid #2a0d10' }}>
        <div className="container py-4" style={{ maxWidth: '1140px' }}>
          
          {/* Section Header matching dev.estria.ai */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-5"
          >
            <div className="d-flex align-items-center gap-2 mb-2" style={{ color: '#d96b74', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>—</span> <span>HOW IT WORKS</span>
            </div>
            
            <h2 className="display-4 display-heading text-cream mb-3" style={{ fontSize: '3rem', fontWeight: 700 }}>
              Three steps. No detail left behind.
            </h2>
            
            <p className="lead" style={{ color: '#cbb8ac', maxWidth: '640px', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Itinera discovers your ideal destination, schedules your daily sights & dining, and provides live rain checks with multi-currency tracking.
            </p>
          </motion.div>

          {/* 3-Column Layout (01, 02, 03) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="row g-5"
          >
            {/* Step 01 */}
            <motion.div variants={fadeInUp} className="col-md-4 d-flex flex-column justify-content-between">
              <div>
                <div className="display-1 display-heading mb-2" style={{ color: '#d96b74', fontSize: '3.5rem', fontWeight: 800 }}>
                  01
                </div>
                <h4 className="display-heading text-cream mb-2" style={{ fontSize: '1.4rem' }}>
                  Select Destination & Days
                </h4>
                <p className="small mb-4" style={{ color: '#cbb8ac', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  Pick from 10,000+ global cities on an interactive map, set your duration of stay, and name your trip.
                </p>
              </div>

              {/* Step 01 Widget Card */}
              <div 
                className="p-3 rounded-4 mt-3" 
                style={{ backgroundColor: '#20080b', border: '1px solid #3d1216' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#591D26', color: '#F5EFE9', fontSize: '0.72rem' }}>
                    <MapPin size={10} className="me-1" /> Paris, France
                  </span>
                  <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#120507', color: '#a7f3d0', fontSize: '0.72rem', border: '1px solid #3d1216' }}>
                    ● Selected
                  </span>
                </div>
                <div className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>Parisian Dream Getaway</div>
                <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>5 Days Duration &bull; Summer Season</small>
              </div>
            </motion.div>

            {/* Step 02 */}
            <motion.div variants={fadeInUp} className="col-md-4 d-flex flex-column justify-content-between">
              <div>
                <div className="display-1 display-heading mb-2" style={{ color: '#d96b74', fontSize: '3.5rem', fontWeight: 800 }}>
                  02
                </div>
                <h4 className="display-heading text-cream mb-2" style={{ fontSize: '1.4rem' }}>
                  Pick Sights & Famous Food
                </h4>
                <p className="small mb-4" style={{ color: '#cbb8ac', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  Select famous landmarks, museums, bistros, and cafes with real user ratings and duration estimates.
                </p>
              </div>

              {/* Step 02 Widget Card */}
              <div 
                className="p-3 rounded-4 mt-3" 
                style={{ backgroundColor: '#20080b', border: '1px solid #3d1216' }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#120507', color: '#F5EFE9', fontSize: '0.72rem', border: '1px solid #3d1216' }}>
                    Eiffel Tower + Louvre Tour
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold text-cream" style={{ fontSize: '0.95rem' }}>₹ 4,600 / person</span>
                  <span className="badge px-2 py-0.5 rounded-circle" style={{ backgroundColor: '#224833', color: '#a7f3d0' }}>
                    <Check size={12} />
                  </span>
                </div>
                <small style={{ color: '#D8C8C3', fontSize: '0.78rem' }}>2 Sights &bull; 1 Food Spot Selected</small>
              </div>
            </motion.div>

            {/* Step 03 */}
            <motion.div variants={fadeInUp} className="col-md-4 d-flex flex-column justify-content-between">
              <div>
                <div className="display-1 display-heading mb-2" style={{ color: '#d96b74', fontSize: '3.5rem', fontWeight: 800 }}>
                  03
                </div>
                <h4 className="display-heading text-cream mb-2" style={{ fontSize: '1.4rem' }}>
                  Rain Check & Budget Split
                </h4>
                <p className="small mb-4" style={{ color: '#cbb8ac', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  Automated weather forecasts for outdoor dates and one-click multi-currency budget calculation.
                </p>
              </div>

              {/* Step 03 Widget Card */}
              <div 
                className="p-3 rounded-4 mt-3" 
                style={{ backgroundColor: '#20080b', border: '1px solid #3d1216' }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#193828', color: '#a7f3d0', fontSize: '0.72rem', border: '1px solid #a7f3d0' }}>
                    <Sun size={11} className="me-1" /> Rain Check Approved
                  </span>
                </div>
                <div className="fw-bold text-cream mb-1" style={{ fontSize: '0.95rem' }}>Clear & Sunny (24°C)</div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#d96b74', color: '#120507', fontWeight: 700, fontSize: '0.75rem' }}>
                    Generate Itinerary
                  </span>
                  <small style={{ color: '#D8C8C3', fontSize: '0.75rem' }}>FX: EUR &bull; INR &bull; USD</small>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>


      {/* SECTION 3: VIBRANT BURGUNDY GRADIENT REFERENCE CTA CARD (MATCHING USER REFERENCE IMAGE EXACTLY) */}
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
              background: 'radial-gradient(circle at 50% 0%, #8c353f 0%, #5c1e27 50%, #3e1319 100%)',
              borderRadius: '36px',
              border: '1.5px solid #8e3943',
              boxShadow: '0 24px 50px rgba(0, 0, 0, 0.45)',
              padding: '4.5rem 3rem'
            }}
          >
            {/* Giant Faint Watermark Text matching reference image */}
            <div 
              className="position-absolute top-50 start-50 translate-middle pointer-events-none select-none text-uppercase fw-bold"
              style={{
                fontSize: '11rem',
                color: '#ffffff',
                opacity: 0.05,
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
                zIndex: 1
              }}
            >
              ITINERA
            </div>

            <div className="position-relative" style={{ zIndex: 2 }}>
              <h2 className="display-3 display-heading text-cream mb-3 mx-auto" style={{ fontSize: '3.1rem', maxWidth: '680px', lineHeight: 1.15 }}>
                Never miss a moment <br /> on your journey again.
              </h2>
              
              <p className="lead mx-auto mb-4" style={{ color: '#f2e6dc', maxWidth: '580px', fontSize: '1.15rem', lineHeight: 1.65 }}>
                Itinera organizes your routes, weather rain checks, and multi-currency budgets automatically.
              </p>

              {/* Centered Compact Pill Button matching reference image */}
              <div className="d-flex justify-content-center mb-4">
                <button 
                  onClick={() => onNavigate('planner-flow')} 
                  className="btn btn-pill-cream hover-lift d-inline-flex align-items-center justify-content-center gap-2"
                  style={{ 
                    padding: '0.85rem 2.4rem', 
                    backgroundColor: '#fcefe6', 
                    color: '#3e181c', 
                    fontWeight: 700, 
                    borderRadius: '9999px',
                    width: 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>Get started free &rarr;</span>
                </button>
              </div>

              <div className="small text-cream-muted" style={{ color: '#d8c8c3', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                Instant setup &bull; Automated rain check &bull; Multi-currency budget split
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
