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
          style={{ maxWidth: '960px', zIndex: 10 }}
        >
          {/* Prominent Large Logo above Tagline */}
          <div className="d-inline-flex align-items-center justify-content-center mb-4 w-100">
            <img 
              src="/logo.png" 
              alt="Itinera Logo" 
              style={{ height: '170px', maxWidth: '90%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.4))' }} 
            />
          </div>

          {/* Headline & Tagline */}
          <h1 className="display-3 display-heading mb-3" style={{ fontSize: '3.6rem', color: '#efe2d3', lineHeight: 1.12, letterSpacing: '-0.03em' }}>
            Empowering Personalized <br />
            <span style={{ color: '#efe2d3', fontStyle: 'italic', fontWeight: 400, fontSize: '3.8rem' }}>Travel Planning</span>
          </h1>

          <p className="lead mx-auto mb-4" style={{ color: '#d5c3b5', maxWidth: '640px', fontSize: '1.12rem', lineHeight: 1.7, fontWeight: 400 }}>
            Dream, design, and organize multi-city trips with ease. Interactive day-wise itineraries, automatic budget breakdowns, live weather checks, and multi-currency expense splitting.
          </p>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('planner-flow')} 
              className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
              style={{ width: 'auto', padding: '0.9rem 2.6rem', backgroundColor: '#efe2d3', color: '#3e181c', fontWeight: 700, borderRadius: '9999px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('planner-flow')} 
              className="btn btn-pill-outline hover-lift d-inline-flex align-items-center gap-2"
              style={{ width: 'auto', padding: '0.9rem 2.2rem', borderColor: 'rgba(239, 226, 211, 0.3)', color: '#efe2d3', borderRadius: '9999px' }}
            >
              <span>Explore Destination Map</span>
              <Compass size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Masterpiece 3D Globe Container */}
        <div className="w-100 position-relative mt-3 mb-2" style={{ zIndex: 5, minHeight: '560px' }}>
          <Globe3D />
        </div>

      </section>


      {/* SECTION 2: THREE STEPS "HOW IT WORKS" (CLEAN PITCH BLACK CANVAS) */}
      <section className="py-5 px-3" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(239, 226, 211, 0.12)', borderBottom: '1px solid rgba(239, 226, 211, 0.12)' }}>
        <div className="container py-4" style={{ maxWidth: '1140px' }}>
          
          {/* Section Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-5"
          >
            <div className="d-flex align-items-center gap-2 mb-2" style={{ color: '#efe2d3', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>—</span> <span>HOW IT WORKS</span>
            </div>
            
            <h2 className="display-4 display-heading text-cream mb-3" style={{ fontSize: '3rem', fontWeight: 700 }}>
              Three steps. No detail left behind.
            </h2>
            
            <p className="lead" style={{ color: '#d5c3b5', maxWidth: '640px', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Itinera discovers your ideal destination, schedules your daily sights & dining, and provides live weather checks with multi-currency tracking.
            </p>
          </motion.div>

          {/* 3-Column Layout (01, 02, 03) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="row g-4 g-md-5"
          >
            {/* Step 01 */}
            <motion.div 
              variants={fadeInUp} 
              className="col-md-4 d-flex flex-column justify-content-between pe-md-4"
              style={{ borderRight: '1px solid rgba(239, 226, 211, 0.15)' }}
            >
              <div>
                <div className="display-1 display-heading mb-2" style={{ color: '#d96b74', fontSize: '3.5rem', fontWeight: 800 }}>
                  01
                </div>
                <h4 className="display-heading text-cream mb-2" style={{ fontSize: '1.4rem' }}>
                  Select Destination & Days
                </h4>
                <p className="small mb-4" style={{ color: '#d5c3b5', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  Pick from 10,000+ global cities on an interactive map, set your duration of stay, and name your trip.
                </p>
              </div>

              {/* Step 01 Widget Card */}
              <div 
                className="p-4 rounded-4 mt-4 d-flex flex-column gap-3" 
                style={{ backgroundColor: '#161616', border: '1px solid rgba(239, 226, 211, 0.16)' }}
              >
                <div className="d-flex justify-content-start">
                  <div className="px-3 py-1.5 rounded-pill text-nowrap fw-medium" style={{ backgroundColor: '#efe2d3', color: '#3e181c', fontSize: '0.82rem' }}>
                    Where are you traveling next?
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <div className="px-3 py-2 rounded-4 text-nowrap fw-medium" style={{ backgroundColor: '#2a1215', color: '#efe2d3', border: '1px solid rgba(239, 226, 211, 0.25)', fontSize: '0.82rem' }}>
                    Paris! 5 Days &bull; Eiffel Tower & Louvre
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 02 */}
            <motion.div 
              variants={fadeInUp} 
              className="col-md-4 d-flex flex-column justify-content-between px-md-4"
              style={{ borderRight: '1px solid rgba(239, 226, 211, 0.15)' }}
            >
              <div>
                <div className="display-1 display-heading mb-2" style={{ color: '#d96b74', fontSize: '3.5rem', fontWeight: 800 }}>
                  02
                </div>
                <h4 className="display-heading text-cream mb-2" style={{ fontSize: '1.4rem' }}>
                  Pick Sights & Famous Food
                </h4>
                <p className="small mb-4" style={{ color: '#d5c3b5', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  Select famous landmarks, museums, bistros, and cafes with real user ratings and duration estimates.
                </p>
              </div>

              {/* Step 02 Widget Card */}
              <div 
                className="p-4 rounded-4 mt-4 d-flex flex-column gap-2" 
                style={{ backgroundColor: '#161616', border: '1px solid rgba(239, 226, 211, 0.16)' }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold text-cream" style={{ fontSize: '0.9rem' }}>Parisian Getaway</span>
                  <span className="small d-flex align-items-center gap-1" style={{ color: '#fbbf24', fontSize: '0.78rem' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#fbbf24', borderRadius: '50%' }}></span> Selected
                  </span>
                </div>

                <div className="display-heading text-cream" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  ₹ 4,600 <span className="small text-cream-muted" style={{ fontSize: '0.82rem', fontWeight: 400, color: '#d5c3b5' }}>/ person</span>
                </div>

                <div className="small pt-2 border-top border-secondary-subtle d-flex align-items-center justify-content-between" style={{ color: '#d5c3b5', fontSize: '0.78rem' }}>
                  <span>2 Sights &bull; 1 Dining Spot</span>
                  <span style={{ color: '#fbbf24' }}>✓ 100% Outdoor Approved</span>
                </div>
              </div>
            </motion.div>

            {/* Step 03 */}
            <motion.div 
              variants={fadeInUp} 
              className="col-md-4 d-flex flex-column justify-content-between ps-md-4"
            >
              <div>
                <div className="display-1 display-heading mb-2" style={{ color: '#d96b74', fontSize: '3.5rem', fontWeight: 800 }}>
                  03
                </div>
                <h4 className="display-heading text-cream mb-2" style={{ fontSize: '1.4rem' }}>
                  Weather Check & Budget Split
                </h4>
                <p className="small mb-4" style={{ color: '#d5c3b5', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  Automated weather forecasts for outdoor dates and one-click multi-currency budget calculation.
                </p>
              </div>

              {/* Step 03 Widget Card */}
              <div 
                className="p-4 rounded-4 mt-4 d-flex flex-column gap-2" 
                style={{ backgroundColor: '#161616', border: '1px solid rgba(239, 226, 211, 0.16)' }}
              >
                <div className="d-flex align-items-center gap-1.5" style={{ color: '#fbbf24', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Sun size={13} />
                  <span>Weather Check Approved</span>
                </div>

                <p className="small mb-2" style={{ color: '#d5c3b5', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  Clear & Sunny (24°C) for Paris outdoor dates?
                </p>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-pill-cream px-3 py-1" style={{ fontSize: '0.78rem', backgroundColor: '#efe2d3', color: '#3e181c' }}>
                    Generate Itinerary
                  </button>
                  <button className="btn btn-sm btn-pill-outline px-3 py-1" style={{ fontSize: '0.78rem' }}>
                    FX Split
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>


      {/* SECTION 3: PITCH BLACK CANVAS CTA CARD */}
      <section className="py-5 px-3" style={{ background: '#050505', borderTop: '1px solid rgba(239, 226, 211, 0.12)' }}>
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
            {/* Giant Faint Watermark Text */}
            <div 
              className="position-absolute top-50 start-50 translate-middle pointer-events-none select-none text-uppercase fw-bold"
              style={{
                fontSize: '11rem',
                color: '#efe2d3',
                opacity: 0.04,
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
              
              <p className="lead mx-auto mb-4" style={{ color: '#d5c3b5', maxWidth: '580px', fontSize: '1.15rem', lineHeight: 1.65 }}>
                Itinera organizes your routes, weather checks, and multi-currency budgets automatically.
              </p>

              {/* Centered Compact Pill Button */}
              <div className="d-flex justify-content-center mb-4">
                <button 
                  onClick={() => onNavigate('planner-flow')} 
                  className="btn btn-pill-cream hover-lift d-inline-flex align-items-center justify-content-center gap-2"
                  style={{ 
                    padding: '0.85rem 2.4rem', 
                    backgroundColor: '#efe2d3', 
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

              <div className="small text-cream-muted" style={{ color: '#d5c3b5', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                Instant setup &bull; Automated weather check &bull; Multi-currency budget split
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
