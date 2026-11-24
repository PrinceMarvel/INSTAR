/**
 * Interface de conduite active pour le Chauffeur INSTAR.
 * Guide le conducteur étape par étape et transmet sa position en direct au passager.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import apiClient from '../../config/api';
import { formatCFA, formatDistance } from '../../utils/formatters';
import { Phone, MapPin, Navigation, CheckCircle2, User, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ActiveTripScreen({ rideId, onNavigate }) {
  const { emit, on } = useSocket();

  const [ride, setRide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Récupération de la course active
  const fetchRide = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/rides/${rideId}`);
      setRide(response.data.data);
    } catch (err) {
      setErrorMessage('Impossible de charger les données de la course.');
    } finally {
      setIsLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchRide();
  }, [fetchRide]);

  // Simulation / Transmission de position GPS périodique au passager
  useEffect(() => {
    if (!ride || ride.status === 'COMPLETED' || ride.status === 'CANCELLED') return;

    const interval = setInterval(() => {
      // Émission d'une coordonnée simulée sur Gagnoa
      emit('driver:update_location', {
        longitude: -5.9501 + (Math.random() - 0.5) * 0.005,
        latitude: 6.1302 + (Math.random() - 0.5) * 0.005,
        activeRideId: ride._id,
        passengerId: ride.passenger?._id,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [ride, emit]);

  // Progression séquentielle du statut
  const handleUpdateStatus = async (nextStatus) => {
    setIsUpdating(true);
    setErrorMessage('');

    try {
      const response = await apiClient.patch(`/rides/${rideId}/status`, { status: nextStatus });
      setRide(response.data.data);

      if (nextStatus === 'COMPLETED') {
        // Redirection vers le tableau de bord après clôture
        setTimeout(() => {
          if (onNavigate) onNavigate('driver_dashboard');
        }, 2000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Échec de mise à jour du statut.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="instar-screen justify-center items-center py-12">
        <div className="w-10 h-10 rounded-full border-2 border-instar-secondary border-t-transparent animate-spin mb-3" />
        <p className="text-xs text-instar-text-muted">Chargement de la course...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="instar-screen justify-center text-center py-12">
        <p className="text-xs text-instar-danger mb-4">Course introuvable.</p>
        <Button variant="secondary" onClick={() => onNavigate && onNavigate('driver_dashboard')}>
          Retour au tableau de bord
        </Button>
      </div>
    );
  }

  const grossFare = ride.finalPrice || ride.estimatedPrice || 0;
  const netEarnings = Math.round(grossFare * 0.9);

  return (
    <div className="instar-screen py-5 space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('driver_dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-instar-text hover:text-instar-text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tableau de bord</span>
        </button>

        <Badge variant={ride.status === 'COMPLETED' ? 'success' : 'accent'} dot>
          {ride.status === 'ACCEPTED' && 'Vers le client'}
          {ride.status === 'ARRIVED' && 'Au point de rendez-vous'}
          {ride.status === 'IN_PROGRESS' && 'Course en route'}
          {ride.status === 'COMPLETED' && 'Course clôturée'}
        </Badge>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Fiche Passager & Appel direct */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-instar-secondary/20 flex items-center justify-center font-bold text-instar-text">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-instar-text-muted block font-semibold">Passager</span>
            <h3 className="font-bold text-instar-text text-sm truncate max-w-[170px]">
              {ride.passenger?.fullName || 'Client'}
            </h3>
            <span className="text-[11px] text-instar-text-muted block">
              {ride.passenger?.phoneNumber}
            </span>
          </div>
        </div>

        {ride.passenger?.phoneNumber && (
          <a
            href={`tel:${ride.passenger.phoneNumber}`}
            className="w-10 h-10 rounded-xl bg-instar-secondary flex items-center justify-center text-instar-text shadow-sm hover:bg-instar-secondary-hover transition-colors"
            aria-label="Appeler le passager"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </Card>

      {/* Itinéraire du trajet */}
      <Card className="space-y-3">
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-instar-secondary mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-instar-text-muted block">Point de prise en charge</span>
              <span className="font-bold text-instar-text block truncate">{ride.pickup?.name}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-3 h-3 text-instar-text mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-instar-text-muted block">Destination finale</span>
              <span className="font-bold text-instar-text block truncate">{ride.destination?.name}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-instar-border flex items-center justify-between text-xs">
          <span className="text-instar-text-muted">Distance totale</span>
          <span className="font-bold text-instar-text">{formatDistance(ride.estimatedDistanceKm)}</span>
        </div>
      </Card>

      {/* Rémunération de la course */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
        <div>
          <span className="text-yellow-900 block font-medium">Votre gain net garanti (90%)</span>
          <span className="text-lg font-black text-yellow-950 block">{formatCFA(netEarnings)}</span>
        </div>
        <div className="text-right">
          <span className="text-instar-text-muted block text-[10px]">Total à encaisser</span>
          <span className="font-bold text-instar-text block">{formatCFA(grossFare)}</span>
        </div>
      </div>

      {/* Boutons d'action séquentiels */}
      <div className="pt-2">
        {ride.status === 'ACCEPTED' && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isUpdating}
            onClick={() => handleUpdateStatus('ARRIVED')}
            className="shadow-instar-action font-black"
          >
            Je suis arrivé au point de rendez-vous
          </Button>
        )}

        {ride.status === 'ARRIVED' && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isUpdating}
            onClick={() => handleUpdateStatus('IN_PROGRESS')}
            className="shadow-instar-action font-black bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Démarrer la course avec le client
          </Button>
        )}

        {ride.status === 'IN_PROGRESS' && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isUpdating}
            onClick={() => handleUpdateStatus('COMPLETED')}
            className="shadow-instar-action font-black bg-slate-900 hover:bg-black text-white"
          >
            Terminer la course et clôturer
          </Button>
        )}

        {ride.status === 'COMPLETED' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-instar-success text-instar-primary mx-auto flex items-center justify-center font-bold">
              ✓
            </div>
            <h4 className="font-bold text-emerald-950 text-sm">Course terminée avec succès !</h4>
            <p className="text-xs text-emerald-800">
              Votre gain net de {formatCFA(netEarnings)} a été crédité sur votre compte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
