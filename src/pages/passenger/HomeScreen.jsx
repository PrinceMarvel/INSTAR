/**
 * Écran d'accueil principal du Passager INSTAR.
 * Permet la sélection des repères de Gagnoa, l'estimation des tarifs et la commande de course.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LandmarkPicker from '../../components/booking/LandmarkPicker';
import VehicleSelector from '../../components/booking/VehicleSelector';
import RideEstimateCard from '../../components/booking/RideEstimateCard';
import apiClient from '../../config/api';
import { MapPin, Navigation, ArrowUpDown, LogOut, User, AlertCircle, Loader2 } from 'lucide-react';

export default function HomeScreen({ onNavigate }) {
  const { user, logout } = useAuth();

  // Points de repère sélectionnés
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  // État du modal de choix de repère
  const [pickerType, setPickerType] = useState(null); // 'pickup' | 'destination' | null

  // Données d'estimation
  const [vehicleType, setVehicleType] = useState('MOTO_TAXI');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [estimateData, setEstimateData] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calcul automatique de l'estimation dès que le départ et l'arrivée sont définis
  useEffect(() => {
    let isMounted = true;

    const calculateEstimate = async () => {
      if (!pickup?.location?.coordinates || !destination?.location?.coordinates) {
        setEstimateData(null);
        return;
      }

      try {
        setIsEstimating(true);
        setErrorMessage('');
        const response = await apiClient.post('/landmarks/estimate', {
          originCoords: pickup.location.coordinates,
          destinationCoords: destination.location.coordinates,
        });

        if (isMounted && response.data?.data) {
          setEstimateData(response.data.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage('Impossible de calculer l’estimation du trajet.');
        }
      } finally {
        if (isMounted) setIsEstimating(false);
      }
    };

    calculateEstimate();

    return () => {
      isMounted = false;
    };
  }, [pickup, destination]);

  // Inverser départ et destination
  const handleSwapLocations = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
  };

  // Passer commande de la course
  const handleOrderRide = async () => {
    if (!pickup || !destination) {
      setErrorMessage('Veuillez sélectionner un point de départ et une destination.');
      return;
    }

    setIsOrdering(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post('/rides', {
        vehicleType,
        pickup: {
          name: pickup.name,
          landmarkId: pickup.landmarkId,
          coordinates: pickup.location.coordinates,
        },
        destination: {
          name: destination.name,
          landmarkId: destination.landmarkId,
          coordinates: destination.location.coordinates,
        },
        paymentMethod,
      });

      const newRide = response.data.data;
      if (onNavigate) {
        onNavigate('ride_tracking', { rideId: newRide._id });
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Échec de la commande de course.';
      setErrorMessage(serverMsg);
    } finally {
      setIsOrdering(false);
    }
  };

  const selectedFare = estimateData?.estimates?.find((e) => e.vehicleType === vehicleType)?.fare || 0;

  return (
    <div className="instar-screen py-5 space-y-4">
      {/* En-tête passager avec profil et déconnexion */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-instar-secondary shadow-instar-action flex items-center justify-center font-bold text-instar-text">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-instar-text-muted block">Bonjour</span>
            <h2 className="text-sm font-black text-instar-text leading-tight truncate max-w-[180px]">
              {user?.fullName || 'Passager INSTAR'}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          aria-label="Déconnexion"
          className="p-2 rounded-xl text-instar-text-muted hover:text-instar-text hover:bg-instar-surface-alt transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Message d'erreur alertant */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Boîte de sélection Départ & Destination */}
      <Card className="space-y-3">
        {/* Sélecteur Départ */}
        <button
          type="button"
          onClick={() => setPickerType('pickup')}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-instar-surface-alt hover:bg-instar-border/50 text-left transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-instar-secondary/20 flex items-center justify-center text-instar-text shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-instar-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold text-instar-text-muted block">Départ</span>
            <span className="text-xs font-bold text-instar-text block truncate">
              {pickup?.name || 'Point de départ à Gagnoa...'}
            </span>
          </div>
        </button>

        {/* Bouton d'inversion */}
        <div className="flex justify-center -my-1.5">
          <button
            type="button"
            onClick={handleSwapLocations}
            aria-label="Inverser les adresses"
            className="w-7 h-7 rounded-full bg-instar-surface border border-instar-border flex items-center justify-center text-instar-text hover:bg-instar-surface-alt shadow-sm transition-transform active:rotate-180 duration-200"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sélecteur Destination */}
        <button
          type="button"
          onClick={() => setPickerType('destination')}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-instar-surface-alt hover:bg-instar-border/50 text-left transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-instar-text/10 flex items-center justify-center text-instar-text shrink-0">
            <MapPin className="w-4 h-4 text-instar-text" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold text-instar-text-muted block">Destination</span>
            <span className="text-xs font-bold text-instar-text block truncate">
              {destination?.name || 'Où allez-vous à Gagnoa ?'}
            </span>
          </div>
        </button>
      </Card>

      {/* Indicateur de calcul d'estimation */}
      {isEstimating && (
        <div className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-instar-text-muted">
          <Loader2 className="w-4 h-4 animate-spin text-instar-secondary" />
          <span>Calcul du meilleur itinéraire...</span>
        </div>
      )}

      {/* Bloc Véhicule et Détails si estimation prête */}
      {estimateData && !isEstimating && (
        <>
          <VehicleSelector
            selectedType={vehicleType}
            onSelect={setVehicleType}
            estimates={estimateData.estimates}
            estimatedDurationMin={estimateData.estimatedDurationMin}
          />

          <RideEstimateCard
            pickup={pickup}
            destination={destination}
            distanceKm={estimateData.distanceKm}
            durationMin={estimateData.estimatedDurationMin}
            fare={selectedFare}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />

          <Button
            type="button"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isOrdering}
            onClick={handleOrderRide}
            className="sticky bottom-4 shadow-instar-action"
          >
            Commander ma course ({selectedFare} FCFA)
          </Button>
        </>
      )}

      {/* Tiroir sélecteur de repères */}
      <LandmarkPicker
        isOpen={Boolean(pickerType)}
        onClose={() => setPickerType(null)}
        currentValue={pickerType === 'pickup' ? pickup : destination}
        title={pickerType === 'pickup' ? 'Départ : Choisir un repère' : 'Destination : Choisir un repère'}
        onSelect={(landmark) => {
          if (pickerType === 'pickup') {
            setPickup(landmark);
          } else {
            setDestination(landmark);
          }
        }}
      />
    </div>
  );
}
