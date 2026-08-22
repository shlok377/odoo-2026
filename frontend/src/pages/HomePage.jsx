import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Compass, MapPin, Calendar, DollarSign, 
  Share2, CloudRain, Users, ShieldCheck, Sparkles, CheckCircle2, ChevronRight,
  Briefcase, Camera, Globe, Sun, Anchor, Award, CheckSquare, Search
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
    visible: { transition: { staggerChildren: 0.12 } }
  };

  return (
    <div className="w-100 overflow-hidden">
      
      {/* SECTION 1: MAIN HERO WITH PROMINENT LOGO & 3D GLOBE MASTERPIECE */}
      <section className="position-relative pt-5 pb-4 px-3 d-flex flex-column align-items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container"
          style={{ maxWidth: '950px', zIndex: 10 }}
        >
          {/* Prominent Large Logo above Tagline */}
          <div className="d-inline-flex align-items-center justify-content-center mb-4">
            <img 
              src="/logo.png" 
              alt="Itinera Logo" 
              style={{ height: '95px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>

          {/* Tagline & Headline */}
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
              onClick={() => onNavigate('auth-register')} 
              className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
              style={{ width: 'auto', padding: '0.85rem 2.2rem' }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => onNavigate('auth-login')} 
              className="btn btn-pill-outline hover-lift d-inline-flex align-items-center gap-2"
              style={{ width: 'auto', padding: '0.85rem 2rem' }}
            >
              <span>Explore Demo Trip</span>
              <Compass size={18} />
            </button>
          </div>
        </motion.div>

        {/* Masterpiece 3D Globe Container (Right-Tilted + Scroll-Driven Rotation & Zoom) */}
        <div className="w-100 position-relative my-3" style={{ zIndex: 5, minHeight: '640px' }}>
          <Globe3D />
        </div>

      </section>


      {/* SECTION 2: BLACK ROW 1 — HOW ITINERA WORKS (TUTORIAL SECTION) */}
      <section className="py-5 px-3" style={{ background: '#120608', borderTop: '1px solid #2a0d10', borderBottom: '1px solid #2a0d10' }}>
        <div className="container py-4">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="text-center mb-5"
          >
            <span className="badge rounded-pill mb-2 px-3 py-2" style={{ background: '#3b1417', border: '1px solid #572227', color: '#cbb8ac', fontSize: '0.85rem' }}>
              Simple 4-Step Workflow
            </span>
            <h2 className="display-4 display-heading text-cream" style={{ fontSize: '2.5rem' }}>
              How Itinera Simplifies Travel
            </h2>
            <p className="small text-cream-muted mx-auto" style={{ maxWidth: '550px', color: '#cbb8ac' }}>
              From initial spark to seamless journey — everything stored in a structured relational SQL database.
            </p>
          </motion.div>

          {/* 4 Tutorial Cards */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="row g-4"
          >
            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 h-100" style={{ background: '#1c0a0d', border: '1px solid #3d1418' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-3 rounded-3" style={{ background: '#3b1417' }}>
                    <MapPin size={24} style={{ color: '#f5efe9' }} />
                  </div>
                  <span className="display-heading" style={{ fontSize: '1.8rem', color: '#572227' }}>01</span>
                </div>
                <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.2rem' }}>Discover Cities</h5>
                <p className="small mb-0" style={{ color: '#cbb8ac', lineHeight: 1.5 }}>
                  Explore global destinations, filter by cost index or region, and add stop durations easily.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 h-100" style={{ background: '#1c0a0d', border: '1px solid #3d1418' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-3 rounded-3" style={{ background: '#3b1417' }}>
                    <Calendar size={24} style={{ color: '#f5efe9' }} />
                  </div>
                  <span className="display-heading" style={{ fontSize: '1.8rem', color: '#572227' }}>02</span>
                </div>
                <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.2rem' }}>Build Itinerary</h5>
                <p className="small mb-0" style={{ color: '#cbb8ac', lineHeight: 1.5 }}>
                  Assign day-wise sightseeing, food tours, and transport with interactive drag & drop ordering.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 h-100" style={{ background: '#1c0a0d', border: '1px solid #3d1418' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-3 rounded-3" style={{ background: '#3b1417' }}>
                    <CloudRain size={24} style={{ color: '#f5efe9' }} />
                  </div>
                  <span className="display-heading" style={{ fontSize: '1.8rem', color: '#572227' }}>03</span>
                </div>
                <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.2rem' }}>Budget & Rain Checks</h5>
                <p className="small mb-0" style={{ color: '#cbb8ac', lineHeight: 1.5 }}>
                  Automatic multi-currency conversion, overbudget alerts, and weather rain check forecasts.
                </p>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={fadeInUp} className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 h-100" style={{ background: '#1c0a0d', border: '1px solid #3d1418' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-3 rounded-3" style={{ background: '#3b1417' }}>
                    <Share2 size={24} style={{ color: '#f5efe9' }} />
                  </div>
                  <span className="display-heading" style={{ fontSize: '1.8rem', color: '#572227' }}>04</span>
                </div>
                <h5 className="display-heading text-cream mb-2" style={{ fontSize: '1.2rem' }}>Share & Export</h5>
                <p className="small mb-0" style={{ color: '#cbb8ac', lineHeight: 1.5 }}>
                  Share public read-only URLs, split expenses with group members, and export clean PDF schedules.
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>


      {/* SECTION 3: FEATURE SPOTLIGHT GRID (BURGUNDY SECTION) */}
      <section className="py-5 px-3" style={{ background: '#532328' }}>
        <div className="container py-4">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="row g-4 align-items-center"
          >
            {/* Feature Highlight 1 */}
            <div className="col-lg-6">
              <div className="p-4 rounded-4" style={{ background: '#3d161a', border: '1px solid #63262c' }}>
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: '#260a0c', color: '#f5efe9', fontSize: '0.8rem' }}>
                  <Sparkles size={14} />
                  <span>Smart Automation</span>
                </div>

                <h3 className="display-heading text-cream mb-3" style={{ fontSize: '2rem' }}>
                  Rain Check Forecasts & Multi-Currency Conversion
                </h3>

                <p className="small mb-4" style={{ color: '#cbb8ac', lineHeight: 1.6 }}>
                  Itinera automatically checks weather conditions for your travel dates and calculates live currency conversions across USD, EUR, GBP, INR, and JPY.
                </p>

                <div className="d-flex flex-column gap-2.5">
                  <div className="d-flex align-items-center gap-2 small text-cream">
                    <CheckCircle2 size={16} style={{ color: '#f5efe9' }} />
                    <span>Real-time weather warnings for outdoor itinerary activities</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-cream">
                    <CheckCircle2 size={16} style={{ color: '#f5efe9' }} />
                    <span>Group trip contribution expense splitter for multi-person trips</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-cream">
                    <CheckCircle2 size={16} style={{ color: '#f5efe9' }} />
                    <span>One-click PDF download & public itinerary link sharing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlight 2 */}
            <div className="col-lg-6">
              <div className="p-4 rounded-4" style={{ background: '#2e0d11', border: '1px solid #572227' }}>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3" style={{ borderColor: '#4a171c' }}>
                  <div className="d-flex align-items-center gap-2">
                    <MapPin size={18} style={{ color: '#f5efe9' }} />
                    <span className="fw-bold text-cream">Paris &rarr; Rome &rarr; Tokyo</span>
                  </div>
                  <span className="badge rounded-pill" style={{ background: '#532328', color: '#f5efe9' }}>12 Days Trip</span>
                </div>

                {/* Sample Activity List Preview */}
                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="p-2.5 rounded-3 d-flex align-items-center justify-content-between" style={{ background: '#3b1417' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-dark">Day 1</span>
                      <span className="small text-cream">Eiffel Tower Guided Tour</span>
                    </div>
                    <span className="small fw-semibold text-cream">$45.00</span>
                  </div>

                  <div className="p-2.5 rounded-3 d-flex align-items-center justify-content-between" style={{ background: '#3b1417' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-dark">Day 2</span>
                      <span className="small text-cream">Louvre Museum Walking Tour</span>
                    </div>
                    <span className="small fw-semibold text-cream">$30.00</span>
                  </div>

                  <div className="p-2.5 rounded-3 d-flex align-items-center justify-content-between" style={{ background: '#3b1417' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-dark">Day 3</span>
                      <span className="small text-cream">Colosseum & Roman Forum</span>
                    </div>
                    <span className="small fw-semibold text-cream">$50.00</span>
                  </div>
                </div>

                <div className="p-3 rounded-3 d-flex align-items-center justify-content-between" style={{ background: '#1c080a' }}>
                  <span className="small text-cream-muted">Estimated Total Cost</span>
                  <span className="h5 mb-0 text-cream display-heading">$1,250 USD</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </section>


      {/* SECTION 4: BLACK ROW 2 — CALL TO ACTION BANNER */}
      <section className="py-5 px-3" style={{ background: '#0e0406', borderTop: '1px solid #2a0d10' }}>
        <div className="container text-center py-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ maxWidth: '700px' }}
            className="mx-auto"
          >
            <h2 className="display-4 display-heading text-cream mb-3" style={{ fontSize: '2.5rem' }}>
              Ready to Start Your Journey?
            </h2>
            <p className="small text-cream-muted mb-4" style={{ color: '#cbb8ac', fontSize: '1.05rem' }}>
              Sign up now or test with our 1-click evaluation account to experience Itinera.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button 
                onClick={() => onNavigate('auth-register')} 
                className="btn btn-pill-cream hover-lift d-inline-flex align-items-center gap-2"
                style={{ width: 'auto', padding: '0.85rem 2.2rem' }}
              >
                <span>Create Free Account</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
