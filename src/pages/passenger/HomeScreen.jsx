/**
 * Écran d'accueil principal du Passager INSTAR.
 * Interface de réservation directe moderne inspirée de Yango et Uber (panneau flottant + carte interactive).
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LandmarkPicker from '../../components/booking/LandmarkPicker';
import VehicleSelector from '../../components/booking/VehicleSelector';
import RideEstimateCard from '../../components/booking/RideEstimateCard';
import GagnoaMapVisual from '../../components/map/GagnoaMapVisual';
import apiClient from '../../config/api';
import {
  ArrowUpDown,
  LogOut,
  User,
  AlertCircle,
  Loader2,
  Clock,
  History,
} from 'lucide-react';

export default function HomeScreen({ onNavigate }) {
  const { user, logout } = useAuth();

  // Points de repère sélectionnés
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  // État du tiroir de sélection de repères
  const [pickerType, setPickerType] = useState(null);

  // Configuration de la course
  const [vehicleType, setVehicleType] = useState('MOTO_TAXI');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [estimateData, setEstimateData] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calcul automatique de l'estimation de course
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

  // Passer commande
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

  const selectedFare = estimateData?.estimates?.find((e) => e.vehicleType === vehicleType)?.fare || 200;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden">
      {/* 1. Barre de navigation supérieure (Style Yango) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-instar-secondary shadow-sm flex items-center justify-center font-black text-slate-900 text-lg">
              IN
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">INSTAR</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
            Gagnoa Transport
          </span>
        </div>

        {/* Profil et actions rapides */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('ride_history')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Mes courses</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 hidden md:inline truncate max-w-[120px]">
              {user?.fullName || 'Passager'}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Déconnexion"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Contenu principal : Panneau flottant gauche + Carte en fond */}
      <main className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Panneau de réservation flottant (Gauche sur desktop, tiroir sur mobile) */}
        <aside className="w-full md:w-[420px] lg:w-[460px] bg-white border-r border-slate-200 p-4 md:p-6 flex flex-col justify-between shrink-0 z-10 shadow-xl overflow-y-auto max-h-[50vh] md:max-h-none">
          <div className="space-y-4">
            {/* Boîte des adresses (Depuis / Où allez-vous) */}
            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
              {/* Ligne départ */}
              <button
                type="button"
                onClick={() => setPickerType('pickup')}
                className="w-full flex items-center gap-3 text-left transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Depuis
                  </span>
                  <span className="text-sm font-semibold text-slate-900 truncate block group-hover:text-black">
                    {pickup?.name || 'Point de départ à Gagnoa...'}
                  </span>
                </div>
              </button>

              {/* Ligne séparatrice avec bouton inversion */}
              <div className="relative pl-3 flex items-center">
                <div className="w-px h-4 bg-slate-300 ml-2" />
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  aria-label="Inverser les repères"
                  className="absolute right-0 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-transform active:rotate-180"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ligne destination */}
              <button
                type="button"
                onClick={() => setPickerType('destination')}
                className="w-full flex items-center gap-3 text-left transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Où allez-vous ?
                  </span>
                  <span className="text-sm font-semibold text-slate-900 truncate block group-hover:text-black">
                    {destination?.name || 'Choisir un lieu à Gagnoa...'}
                  </span>
                </div>
              </button>
            </div>

            {/* Alerte d'erreur éventuelle */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Indicateur de calcul de trajet */}
            {isEstimating && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-instar-secondary" />
                <span>Calcul de l'itinéraire optimal...</span>
              </div>
            )}

            {/* Sélecteur de véhicules (Motos & Taxis) */}
            <VehicleSelector
              selectedType={vehicleType}
              onSelect={setVehicleType}
              estimates={estimateData?.estimates || []}
              estimatedDurationMin={estimateData?.estimatedDurationMin || 5}
            />

            {/* Détails du trajet si calculé */}
            {estimateData && !isEstimating && (
              <RideEstimateCard
                pickup={pickup}
                destination={destination}
                distanceKm={estimateData.distanceKm}
                durationMin={estimateData.estimatedDurationMin}
                fare={selectedFare}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
            )}
          </div>

          {/* Bouton d'action principal type Yango */}
          <div className="pt-4 mt-auto">
            <Button
              type="button"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isOrdering}
              disabled={!pickup || !destination}
              onClick={handleOrderRide}
              className="py-4 font-black text-base shadow-lg bg-instar-secondary text-slate-900 hover:bg-yellow-400"
            >
              {pickup && destination
                ? `Commander (${selectedFare} FCFA)`
                : 'Choisissez départ et destination'}
            </Button>
          </div>
        </aside>

        {/* Zone de carte interactive plein écran (Droite sur desktop, arrière-plan sur mobile) */}
        <section className="flex-1 relative h-full">
          <GagnoaMapVisual pickup={pickup} destination={destination} />
        </section>
      </main>

      {/* 3. Modal sélecteur de repères géographiques */}
      <LandmarkPicker
        isOpen={Boolean(pickerType)}
        onClose={() => setPickerType(null)}
        currentValue={pickerType === 'pickup' ? pickup : destination}
        title={pickerType === 'pickup' ? 'Point de départ' : 'Où allez-vous ?'}
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
