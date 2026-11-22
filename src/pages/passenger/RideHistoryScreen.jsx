/**
 * Écran d'Historique des courses du Passager INSTAR.
 * Répertorie tous les trajets passés avec consultation instantanée des reçus officiels.
 */

import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import RideReceiptModal from '../../components/booking/RideReceiptModal';
import apiClient from '../../config/api';
import { formatCFA, formatDateShortFr } from '../../utils/formatters';
import { ArrowLeft, Clock, MapPin, Receipt, AlertCircle } from 'lucide-react';

export default function RideHistoryScreen({ onNavigate }) {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedReceiptRideId, setSelectedReceiptRideId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // On récupère les courses de l'utilisateur
        const response = await apiClient.get('/rides/active');
        // Si aucune course active, on liste l'historique
        if (isMounted) {
          // Pour l'instant mock/API
          setRides([]);
        }
      } catch (err) {
        if (isMounted) setErrorMessage('Échec du chargement de l’historique.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

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

        <h1 className="text-sm font-bold text-instar-text">Mes courses</h1>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-instar-text-muted">
          Chargement de vos trajets...
        </div>
      ) : rides.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-instar-surface-alt mx-auto flex items-center justify-center text-instar-text-muted">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-instar-text text-sm">Aucune course enregistrée</h3>
          <p className="text-xs text-instar-text-muted max-w-xs mx-auto">
            Vos futurs trajets dans la ville de Gagnoa apparaîtront ici avec leurs reçus numériques officiels.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate && onNavigate('home')}>
            Commander un trajet
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {rides.map((ride) => (
            <Card key={ride._id} className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-instar-border text-xs">
                <span className="font-semibold text-instar-text-muted">
                  {formatDateShortFr(ride.createdAt)}
                </span>
                <Badge variant={ride.status === 'COMPLETED' ? 'success' : 'danger'}>
                  {ride.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                </Badge>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-instar-text">
                  <MapPin className="w-3.5 h-3.5 text-instar-secondary shrink-0" />
                  <span className="truncate">{ride.pickup?.name} ➔ {ride.destination?.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-instar-border">
                <span className="font-black text-sm text-instar-text">
                  {formatCFA(ride.finalPrice || ride.estimatedPrice)}
                </span>

                {ride.status === 'COMPLETED' && (
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptRideId(ride._id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-instar-text hover:underline"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Reçu</span>
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modale de reçu */}
      <RideReceiptModal
        isOpen={Boolean(selectedReceiptRideId)}
        onClose={() => setSelectedReceiptRideId(null)}
        rideId={selectedReceiptRideId}
      />
    </div>
  );
}
