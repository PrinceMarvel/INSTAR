/**
 * Tableau de bord principal du Chauffeur INSTAR.
 * Bascule de disponibilité, écoute des courses entrantes et suivi des gains journaliers.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import RideAlertModal from '../../components/driver/RideAlertModal';
import apiClient from '../../config/api';
import { formatCFA } from '../../utils/formatters';
import { Power, Wallet, TrendingUp, Star, ShieldAlert, LogOut, Bike, Car, AlertCircle } from 'lucide-react';

export default function DriverDashboard({ onNavigate }) {
  const { user, logout } = useAuth();
  const { on, isConnected } = useSocket();

  const [driverStats, setDriverStats] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [incomingRide, setIncomingRide] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Récupération des statistiques du chauffeur
  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get('/drivers/stats');
      const stats = response.data.data;
      setDriverStats(stats);
      setIsAvailable(stats.status === 'AVAILABLE');
    } catch (err) {
      // Ignorer si non disponible
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Écouteur de nouvelles courses via WebSocket
  useEffect(() => {
    const unsubNewRequest = on('ride:new_request', (rideData) => {
      if (isAvailable) {
        setIncomingRide(rideData);
      }
    });

    return () => {
      unsubNewRequest();
    };
  }, [on, isAvailable]);

  // Bascule du statut En ligne / Hors ligne
  const handleToggleAvailability = async () => {
    if (!driverStats?.isApproved) {
      setErrorMessage('Votre compte est en cours d’approbation par l’administration de Gagnoa.');
      return;
    }

    setIsTogglingStatus(true);
    setErrorMessage('');
    const nextStatus = isAvailable ? 'OFFLINE' : 'AVAILABLE';

    try {
      await apiClient.patch('/drivers/status', { status: nextStatus });
      setIsAvailable(!isAvailable);
      fetchStats();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Échec du changement de statut.');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Acceptation atomique d'une course
  const handleAcceptRide = async (rideId) => {
    try {
      const response = await apiClient.post(`/rides/${rideId}/accept`);
      setIncomingRide(null);
      if (onNavigate) {
        onNavigate('active_trip', { rideId: response.data.data._id });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Cette course n’est plus disponible.');
      setIncomingRide(null);
    }
  };

  return (
    <div className="instar-screen py-5 space-y-4">
      {/* En-tête Chauffeur */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-instar-secondary shadow-instar-action flex items-center justify-center font-bold text-instar-text">
            {user?.vehicleType === 'MOTO_TAXI' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-instar-text-muted block">Conducteur INSTAR</span>
            <h2 className="text-sm font-black text-instar-text leading-tight truncate max-w-[170px]">
              {user?.fullName || 'Chauffeur'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('driver_wallet')}
            aria-label="Mon portefeuille"
            className="p-2 rounded-xl text-instar-text hover:bg-instar-surface-alt transition-colors"
          >
            <Wallet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={logout}
            aria-label="Déconnexion"
            className="p-2 rounded-xl text-instar-text-muted hover:text-instar-text transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Avertissement compte non approuvé */}
      {driverStats && !driverStats.isApproved && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-yellow-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-yellow-800 mt-0.5" />
          <span>
            Votre dossier est en cours de validation par nos modérateurs de Gagnoa. Vous serez alerté dès que vous pourrez prendre des courses.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bouton central de disponibilité (En Ligne / Hors Ligne) */}
      <Card className="text-center py-6 space-y-3">
        <div className="flex justify-center">
          <button
            type="button"
            disabled={isTogglingStatus || !driverStats?.isApproved}
            onClick={handleToggleAvailability}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
              isAvailable
                ? 'bg-instar-secondary text-instar-text ring-4 ring-yellow-300 shadow-instar-action active:scale-95'
                : 'bg-instar-surface-alt text-instar-text-muted border-2 border-instar-border hover:bg-instar-border/50'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            <Power className="w-7 h-7 mb-1" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              {isAvailable ? 'En Ligne' : 'Hors Ligne'}
            </span>
          </button>
        </div>

        <div>
          <Badge variant={isAvailable ? 'success' : 'neutral'} dot>
            {isAvailable ? 'Prêt à recevoir des courses à Gagnoa' : 'Actuellement indisponible'}
          </Badge>
        </div>
      </Card>

      {/* Statistiques du jour & Portefeuille */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gains du jour */}
        <Card className="space-y-1">
          <div className="flex items-center justify-between text-instar-text-muted">
            <span className="text-[11px] font-semibold">Gains du jour</span>
            <TrendingUp className="w-3.5 h-3.5 text-instar-success" />
          </div>
          <span className="text-lg font-black text-instar-text block">
            {formatCFA(driverStats?.dailyEarnings || 0)}
          </span>
          <span className="text-[10px] text-instar-text-muted block">
            {driverStats?.totalRides || 0} course(s) réalisée(s)
          </span>
        </Card>

        {/* Note et véhicule */}
        <Card className="space-y-1">
          <div className="flex items-center justify-between text-instar-text-muted">
            <span className="text-[11px] font-semibold">Note moyenne</span>
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
          </div>
          <span className="text-lg font-black text-instar-text block">
            {driverStats?.averageRating?.toFixed(1) || '5.0'} / 5
          </span>
          <span className="text-[10px] text-instar-text-muted block font-mono uppercase truncate">
            {driverStats?.licensePlate || user?.licensePlate || '—'}
          </span>
        </Card>
      </div>

      {/* Raccourci vers le portefeuille virtuel */}
      <Card
        interactive
        onClick={() => onNavigate && onNavigate('driver_wallet')}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-instar-surface-alt flex items-center justify-center text-instar-text">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-instar-text block">Portefeuille Virtuel INSTAR</span>
            <span className="text-[11px] text-instar-text-muted block">Commissions (10%) & Solde net</span>
          </div>
        </div>
        <span className="text-xs font-black text-instar-text">Consulter ➔</span>
      </Card>

      {/* Alerte modale de course entrante */}
      <RideAlertModal
        isOpen={Boolean(incomingRide)}
        rideRequest={incomingRide}
        onAccept={handleAcceptRide}
        onDecline={() => setIncomingRide(null)}
      />
    </div>
  );
}
