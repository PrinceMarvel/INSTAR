/**
 * Boîte modale d'alerte de course entrante pour les chauffeurs INSTAR.
 * Affiche le compte à rebours, l'itinéraire et la rémunération nette (90%).
 */

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Bike, Car, MapPin, Navigation, Clock, BellRing, X } from 'lucide-react';
import { formatCFA, formatDistance, formatDuration } from '../../utils/formatters';

export default function RideAlertModal({
  isOpen,
  rideRequest,
  onAccept,
  onDecline,
  countdownSeconds = 25,
}) {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (!isOpen || !rideRequest) {
      setTimeLeft(countdownSeconds);
      return;
    }

    setTimeLeft(countdownSeconds);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onDecline) onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, rideRequest, countdownSeconds, onDecline]);

  if (!isOpen || !rideRequest) return null;

  // Calcul du gain net chauffeur estimé (90%)
  const grossFare = rideRequest.estimatedPrice || 0;
  const netEarnings = Math.round(grossFare * 0.9);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept(rideRequest.rideId);
    } finally {
      setIsAccepting(false);
    }
  };

  const progressPercent = (timeLeft / countdownSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onDecline} />

      <div className="relative z-10 w-full max-w-md bg-instar-surface rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-instar-border space-y-4 text-left">
        {/* Barre de compte à rebours visuelle */}
        <div className="w-full h-1.5 bg-instar-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-instar-secondary transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* En-tête de l'alerte */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-instar-secondary flex items-center justify-center shadow-instar-action animate-bounce">
              <BellRing className="w-5 h-5 text-instar-text" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-yellow-800 uppercase tracking-wider block">
                Nouvelle Course ({timeLeft}s)
              </span>
              <h3 className="text-base font-black text-instar-text">
                {rideRequest.vehicleType === 'MOTO_TAXI' ? 'Demande Moto-taxi' : 'Demande Taxi communal'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onDecline}
            className="p-1 rounded-full text-instar-text-muted hover:text-instar-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rémunération nette mise en avant */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-yellow-900 font-medium block">Votre part nette (90%)</span>
            <span className="text-xl font-black text-yellow-950 block">{formatCFA(netEarnings)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-instar-text-muted block">Tarif total passager</span>
            <span className="text-xs font-bold text-instar-text line-through opacity-70">
              {formatCFA(grossFare)}
            </span>
          </div>
        </div>

        {/* Itinéraire */}
        <div className="space-y-2 text-xs bg-instar-surface-alt rounded-2xl p-3.5">
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-instar-secondary mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-instar-text-muted block">Prendre au repère</span>
              <span className="font-bold text-instar-text truncate block">{rideRequest.pickup?.name}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-3 h-3 text-instar-text mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-instar-text-muted block">Déposer à</span>
              <span className="font-bold text-instar-text truncate block">{rideRequest.destination?.name}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-instar-border flex items-center justify-between text-[11px] text-instar-text-muted">
            <span>Distance : {formatDistance(rideRequest.estimatedDistanceKm)}</span>
            <span>Durée : ~{formatDuration(rideRequest.estimatedDurationMin)}</span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="secondary" size="lg" onClick={onDecline}>
            Ignorer
          </Button>
          <Button
            variant="primary"
            size="lg"
            isLoading={isAccepting}
            onClick={handleAccept}
            className="shadow-instar-action font-black"
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
