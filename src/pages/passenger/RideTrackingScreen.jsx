/**
 * Écran de suivi en direct d'une course INSTAR pour le passager.
 * Connexion WebSocket Socket.io pour la mise à jour instantanée des statuts et de la position.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import PaymentModal from '../../components/booking/PaymentModal';
import RideReceiptModal from '../../components/booking/RideReceiptModal';
import apiClient from '../../config/api';
import { formatCFA, formatDistance, formatDuration } from '../../utils/formatters';
import { Phone, Bike, Car, MapPin, AlertCircle, XCircle, Star, ArrowLeft } from 'lucide-react';

export default function RideTrackingScreen({ rideId, onNavigate }) {
  const { on, emit } = useSocket();

  const [ride, setRide] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Modales
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changement de programme');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Chargement initial des données de la course
  const fetchRideDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/rides/${rideId}`);
      const rideData = response.data.data;
      setRide(rideData);

      if (rideData.status === 'COMPLETED' && rideData.paymentStatus !== 'COMPLETED') {
        setIsPaymentModalOpen(true);
      } else if (rideData.status === 'COMPLETED' && rideData.paymentStatus === 'COMPLETED') {
        setIsReceiptModalOpen(true);
      }
    } catch (err) {
      setErrorMessage('Impossible de récupérer les détails de la course.');
    } finally {
      setIsLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchRideDetails();
  }, [fetchRideDetails]);

  // Écouteurs WebSockets temps réel
  useEffect(() => {
    emit('ride:join_room', { rideId });

    // Course acceptée par un chauffeur
    const unsubAccepted = on('ride:accepted', (data) => {
      setRide((prev) => (prev ? { ...prev, status: 'ACCEPTED', driver: data.driver } : prev));
    });

    // Progression d'étape (ARRIVED, IN_PROGRESS, COMPLETED)
    const unsubStatus = on('ride:status_updated', (data) => {
      setRide((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, status: data.status };
        if (data.status === 'COMPLETED') {
          setIsPaymentModalOpen(true);
        }
        return updated;
      });
    });

    // Déplacement GPS du chauffeur
    const unsubDriverMoved = on('ride:driver_moved', (data) => {
      if (data.coordinates) {
        setDriverPosition(data.coordinates);
      }
    });

    // Annulation
    const unsubCancelled = on('ride:cancelled', (data) => {
      setRide((prev) => (prev ? { ...prev, status: 'CANCELLED', cancellationReason: data.reason } : prev));
    });

    // Paiement confirmé
    const unsubPayment = on('payment:confirmed', () => {
      setIsPaymentModalOpen(false);
      setIsReceiptModalOpen(true);
      setRide((prev) => (prev ? { ...prev, paymentStatus: 'COMPLETED' } : prev));
    });

    return () => {
      emit('ride:leave_room', { rideId });
      unsubAccepted();
      unsubStatus();
      unsubDriverMoved();
      unsubCancelled();
      unsubPayment();
    };
  }, [rideId, on, emit]);

  // Annuler la course
  const handleCancelRide = async () => {
    try {
      await apiClient.post(`/rides/${rideId}/cancel`, { reason: cancelReason });
      setIsCancelModalOpen(false);
      fetchRideDetails();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Échec de l’annulation.');
    }
  };

  if (isLoading) {
    return (
      <div className="instar-screen justify-center items-center py-10">
        <div className="w-10 h-10 rounded-full border-2 border-instar-secondary border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-instar-text-muted">Connexion à votre course...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="instar-screen justify-center text-center py-10">
        <p className="text-xs text-instar-danger font-medium mb-4">Course introuvable.</p>
        <Button variant="secondary" onClick={() => onNavigate && onNavigate('home')}>
          Retour à l’accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="instar-screen py-5 space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-instar-text hover:text-instar-text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Accueil</span>
        </button>

        <Badge
          variant={
            ride.status === 'COMPLETED' ? 'success' : ride.status === 'CANCELLED' ? 'danger' : 'accent'
          }
          dot
        >
          {ride.status === 'REQUESTED' && 'Recherche en cours'}
          {ride.status === 'ACCEPTED' && 'Chauffeur en route'}
          {ride.status === 'ARRIVED' && 'Chauffeur sur place'}
          {ride.status === 'IN_PROGRESS' && 'Course en cours'}
          {ride.status === 'COMPLETED' && 'Course terminée'}
          {ride.status === 'CANCELLED' && 'Course annulée'}
        </Badge>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PHASE 1 : En attente d'attribution */}
      {ride.status === 'REQUESTED' && (
        <Card className="text-center py-8 space-y-4">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-instar-secondary/20 animate-ping" />
            <div className="relative w-14 h-14 rounded-full bg-instar-secondary flex items-center justify-center text-instar-text shadow-instar-action">
              {ride.vehicleType === 'MOTO_TAXI' ? <Bike className="w-7 h-7" /> : <Car className="w-7 h-7" />}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-instar-text text-base">Recherche d’un conducteur...</h3>
            <p className="text-xs text-instar-text-muted mt-1 max-w-xs mx-auto">
              Nous notifions les conducteurs de {ride.vehicleType === 'MOTO_TAXI' ? 'motos-taxis' : 'taxis'} les plus proches de votre position à Gagnoa.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCancelModalOpen(true)}
            className="text-instar-danger hover:bg-red-50"
          >
            Annuler la recherche
          </Button>
        </Card>
      )}

      {/* PHASE 2, 3 & 4 : Chauffeur assigné */}
      {ride.driver && ride.status !== 'CANCELLED' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-instar-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-instar-secondary/20 flex items-center justify-center text-instar-text font-black text-lg">
                {ride.driver.fullName?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="font-bold text-instar-text text-sm">{ride.driver.fullName}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-instar-text-muted">
                    {ride.driver.vehicleType === 'MOTO_TAXI' ? 'Moto-taxi' : 'Taxi communal'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-800 bg-yellow-100 px-1.5 py-0.2 rounded">
                    <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                    <span>{ride.driver.averageRating?.toFixed(1) || '5.0'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton appel téléphonique direct */}
            {ride.driver.phoneNumber && (
              <a
                href={`tel:${ride.driver.phoneNumber}`}
                className="w-10 h-10 rounded-xl bg-instar-secondary flex items-center justify-center text-instar-text shadow-sm hover:bg-instar-secondary-hover transition-colors"
                aria-label="Appeler le chauffeur"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-instar-text-muted">Immatriculation / Plaque</span>
            <span className="font-mono font-bold text-instar-text bg-instar-surface-alt px-2.5 py-1 rounded-lg">
              {ride.driver.licensePlate || 'EN RÈGLE'}
            </span>
          </div>

          {ride.status === 'ACCEPTED' && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-yellow-900 font-medium text-center">
              Le conducteur est en route vers : <span className="font-bold">{ride.pickup?.name}</span>
            </div>
          )}

          {ride.status === 'ARRIVED' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold text-center">
              Votre conducteur est arrivé au point de rendez-vous !
            </div>
          )}

          {ride.status === 'IN_PROGRESS' && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium text-center">
              Trajet en cours vers : <span className="font-bold">{ride.destination?.name}</span>
            </div>
          )}

          {/* Bouton d'annulation possible avant la prise en charge */}
          {['ACCEPTED', 'ARRIVED'].includes(ride.status) && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => setIsCancelModalOpen(true)}
              className="text-instar-danger hover:bg-red-50 text-xs"
            >
              Annuler la course
            </Button>
          )}
        </Card>
      )}

      {/* Détails du trajet */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-instar-border">
          <span className="text-instar-text-muted">Tarif officiel</span>
          <span className="font-black text-sm text-instar-text">{formatCFA(ride.finalPrice || ride.estimatedPrice)}</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-instar-secondary mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-instar-text-muted block text-[10px]">Départ</span>
              <span className="font-bold text-instar-text block truncate">{ride.pickup?.name}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-2.5 h-2.5 text-instar-text mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-instar-text-muted block text-[10px]">Destination</span>
              <span className="font-bold text-instar-text block truncate">{ride.destination?.name}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions si clôturé */}
      {ride.status === 'COMPLETED' && (
        <div className="space-y-2">
          {ride.paymentStatus !== 'COMPLETED' ? (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Régler la course ({formatCFA(ride.finalPrice || ride.estimatedPrice)})
            </Button>
          ) : (
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              onClick={() => setIsReceiptModalOpen(true)}
            >
              Voir mon reçu officiel
            </Button>
          )}
        </div>
      )}

      {/* Modale d'annulation */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Annuler la course ?"
      >
        <div className="space-y-4">
          <p className="text-xs text-instar-text-muted">
            Veuillez indiquer le motif de votre annulation :
          </p>

          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full bg-instar-surface-alt text-instar-text text-sm rounded-xl p-3 border border-instar-border outline-none"
          >
            <option value="Changement de programme">Changement de programme</option>
            <option value="Temps d'attente trop long">Temps d'attente trop long</option>
            <option value="Erreur d'adresse ou de repère">Erreur d’adresse ou de repère</option>
            <option value="Autre motif">Autre motif</option>
          </select>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsCancelModalOpen(false)}>
              Retour
            </Button>
            <Button variant="danger" onClick={handleCancelRide}>
              Confirmer l’annulation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modale de Paiement automatique */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        rideId={ride._id}
        amount={ride.finalPrice || ride.estimatedPrice}
        defaultPaymentMethod={ride.paymentMethod}
        onPaymentSuccess={() => {
          setIsPaymentModalOpen(false);
          setIsReceiptModalOpen(true);
          fetchRideDetails();
        }}
      />

      {/* Modale de Reçu officiel */}
      <RideReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        rideId={ride._id}
      />
    </div>
  );
}
