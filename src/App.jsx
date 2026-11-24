/**
 * Application principale et Routeur réactif d'INSTAR.
 * Intègre les fournisseurs de contexte (Langue, Authentification, WebSockets) et orchestre la navigation.
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Écrans publics & onboarding
import WelcomeScreen from './pages/WelcomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterPassengerScreen from './pages/RegisterPassengerScreen';
import RegisterDriverScreen from './pages/RegisterDriverScreen';

// Écrans Passager
import HomeScreen from './pages/passenger/HomeScreen';
import RideTrackingScreen from './pages/passenger/RideTrackingScreen';
import RideHistoryScreen from './pages/passenger/RideHistoryScreen';

// Écrans Chauffeur
import DriverDashboard from './pages/driver/DriverDashboard';
import ActiveTripScreen from './pages/driver/ActiveTripScreen';
import DriverWalletScreen from './pages/driver/DriverWalletScreen';

// Écran Administrateur
import AdminDashboard from './pages/admin/AdminDashboard';

// Gardien de navigation
import ProtectedRoute from './components/auth/ProtectedRoute';

function MainRouter() {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Écran courant : 'welcome' par défaut pour les nouveaux visiteurs (style app mobile)
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [navigationParams, setNavigationParams] = useState({});

  // Redirection automatique dès que la session est restaurée ou connectée
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === 'DRIVER') {
        setCurrentScreen('driver_dashboard');
      } else if (role === 'SUPER_ADMIN' || role === 'SUPPORT') {
        setCurrentScreen('admin_dashboard');
      } else {
        setCurrentScreen('home');
      }
    } else if (!isLoading && !isAuthenticated) {
      // Si déconnecté et sur un écran protégé, retour à l'écran d'accueil
      if (!['welcome', 'login', 'register_passenger', 'register_driver'].includes(currentScreen)) {
        setCurrentScreen('welcome');
      }
    }
  }, [isAuthenticated, role, isLoading]);

  const handleNavigate = (screen, params = {}) => {
    setNavigationParams(params);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Écrans publics (Non authentifiés)
  if (currentScreen === 'welcome') {
    return <WelcomeScreen onNavigate={handleNavigate} />;
  }

  if (currentScreen === 'register_passenger') {
    return <RegisterPassengerScreen onNavigate={handleNavigate} />;
  }

  if (currentScreen === 'register_driver') {
    return <RegisterDriverScreen onNavigate={handleNavigate} />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen onNavigate={handleNavigate} />;
  }

  if (!isAuthenticated) {
    return <WelcomeScreen onNavigate={handleNavigate} />;
  }

  // 2. Écrans Passagers (Protégés)
  if (currentScreen === 'home') {
    return (
      <ProtectedRoute allowedRoles={['PASSENGER']} onRedirectToLogin={() => handleNavigate('login')}>
        <HomeScreen onNavigate={handleNavigate} />
      </ProtectedRoute>
    );
  }

  if (currentScreen === 'ride_tracking') {
    return (
      <ProtectedRoute allowedRoles={['PASSENGER', 'DRIVER']} onRedirectToLogin={() => handleNavigate('login')}>
        <RideTrackingScreen rideId={navigationParams.rideId} onNavigate={handleNavigate} />
      </ProtectedRoute>
    );
  }

  if (currentScreen === 'ride_history') {
    return (
      <ProtectedRoute allowedRoles={['PASSENGER']} onRedirectToLogin={() => handleNavigate('login')}>
        <RideHistoryScreen onNavigate={handleNavigate} />
      </ProtectedRoute>
    );
  }

  // 3. Écrans Chauffeurs (Protégés)
  if (currentScreen === 'driver_dashboard') {
    return (
      <ProtectedRoute allowedRoles={['DRIVER']} onRedirectToLogin={() => handleNavigate('login')}>
        <DriverDashboard onNavigate={handleNavigate} />
      </ProtectedRoute>
    );
  }

  if (currentScreen === 'active_trip') {
    return (
      <ProtectedRoute allowedRoles={['DRIVER']} onRedirectToLogin={() => handleNavigate('login')}>
        <ActiveTripScreen rideId={navigationParams.rideId} onNavigate={handleNavigate} />
      </ProtectedRoute>
    );
  }

  if (currentScreen === 'driver_wallet') {
    return (
      <ProtectedRoute allowedRoles={['DRIVER']} onRedirectToLogin={() => handleNavigate('login')}>
        <DriverWalletScreen onNavigate={handleNavigate} />
      </ProtectedRoute>
    );
  }

  // 4. Écran Administrateur (Protégé)
  if (currentScreen === 'admin_dashboard') {
    return (
      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPPORT']} onRedirectToLogin={() => handleNavigate('login')}>
        <AdminDashboard onNavigate={handleNavigate} />
      </ProtectedRoute>
    );
  }

  // Écran de repli par défaut
  return <WelcomeScreen onNavigate={handleNavigate} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-instar-bg text-instar-text antialiased">
            <MainRouter />
          </div>
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
