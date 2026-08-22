import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import TripPlannerFlowPage from './pages/TripPlannerFlowPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import MyTripsPage from './pages/MyTripsPage';
import BudgetCostPage from './pages/BudgetCostPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import DestinationMapPage from './pages/DestinationMapPage';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'planner-flow', 'trips', 'itinerary-builder', 'auth-login', 'auth-register', 'budget', 'profile', 'analytics'
  const [activePlannedTrip, setActivePlannedTrip] = useState(null);
  const { user } = useAuthStore();

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartItinerary = (plannedTrip) => {
    setActivePlannedTrip(plannedTrip);
    setCurrentPage('itinerary-builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar Header */}
      {currentPage !== 'budget' && (
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {/* Main Content Router */}
      <main className="flex-grow-1 d-flex flex-column">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'planner-flow' && (
          <TripPlannerFlowPage 
            onNavigate={handleNavigate} 
            onStartItinerary={handleStartItinerary}
          />
        )}

        {currentPage === 'trips' && (
          <MyTripsPage 
            onNavigate={handleNavigate}
            onStartItinerary={handleStartItinerary}
          />
        )}

        {currentPage === 'itinerary-builder' && (
          <ItineraryBuilderPage 
            plannedTrip={activePlannedTrip} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'profile' && (
          <ProfileSettingsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsDashboardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'map' && (
          <DestinationMapPage 
            onNavigate={handleNavigate} 
            onStartItinerary={handleStartItinerary}
          />
        )}

        {(currentPage === 'auth-login' || currentPage === 'auth-register') && (
          <AuthPage 
            initialTab={currentPage === 'auth-register' ? 'signup' : 'login'} 
            onAuthSuccess={() => handleNavigate('planner-flow')} 
          />
        )}

        {currentPage === 'budget' && (
          <BudgetCostPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      {currentPage !== 'budget' && (
        <Footer />
      )}
    </div>
  );
}
