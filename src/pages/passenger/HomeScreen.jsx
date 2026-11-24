/**
 * Écran d'accueil principal du Passager INSTAR.
 * Hub de mobilité Super-App façon Yango avec logo INSTAR en JAUNE vif officiel.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import LandmarkPicker from '../../components/booking/LandmarkPicker';
import VehicleSelector from '../../components/booking/VehicleSelector';
import RideEstimateCard from '../../components/booking/RideEstimateCard';
import GagnoaMapVisual from '../../components/map/GagnoaMapVisual';
import ServiceTiles from '../../components/home/ServiceTiles';
import QuickDestinations from '../../components/home/QuickDestinations';
import apiClient from '../../config/api';
import {
  ArrowUpDown,
  LogOut,
  User,
  AlertCircle,
  Loader2,
  History,
  ChevronRight,
  ArrowLeft,
  MapPin,
} from 'lucide-react';

export default function HomeScreen({ onNavigate }) {
  const { user, logout } = useAuth();

  // Mode d'affichage : 'hub' (Super-App Yango) ou 'order' (Commande sur carte)
  const [viewMode, setViewMode] = useState('hub');

  // Points de repère
  const [pickup, setPickup] = useState({
    landmarkId: 'garahio',
    name: 'Carrefour Garahio',
    location: { coordinates: [-5.9525, 6.1319] },
  });
  const [destination, setDestination] = useState(null);
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

  // Sélection rapide depuis les repères du Hub
  const handleSelectQuickLandmark = (landmarkId) => {
    setPickerType('destination');
    setViewMode('order');
  };

  const selectedFare = estimateData?.estimates?.find((e) => e.vehicleType === vehicleType)?.fare || 200;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      {/* 1. Header Super-App avec Logo INSTAR en JAUNE éclatant */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {viewMode === 'order' && (
            <button
              type="button"
              onClick={() => setViewMode('hub')}
              aria-label="Retour à l'accueil"
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Logo INSTAR officiel en JAUNE */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-instar-secondary tracking-tight leading-none select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">
                INSTAR
              </span>
              <button
                type="button"
                onClick={() => setPickerType('pickup')}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors mt-0.5 text-left"
              >
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate max-w-[130px]">{pickup?.name || 'Garahio, Gagnoa'}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Profil et actions rapides */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('ride_history')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Historique</span>
          </button>

          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4 text-instar-secondary" />
            </div>
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

      {/* 2. Contenu principal (Bascule Hub Super-App <-> Mode Commande Carte) */}
      <main className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Panneau gauche : Hub Super-App ou Formulaire de Commande */}
        <aside className="w-full md:w-[440px] lg:w-[480px] bg-white border-r border-slate-200 p-4 md:p-6 flex flex-col justify-between shrink-0 z-10 shadow-xl overflow-y-auto">
          {viewMode === 'hub' ? (
            /* VUE HUB SUPER-APP (Tuiles de services 2x2, Recherche, Suggestions, Promos) */
            <div className="space-y-5 pb-6">
              <ServiceTiles
                onSelectService={(service) => {
                  if (service === 'rides') setViewMode('order');
                  else setPickerType('destination');
                }}
              />

              <QuickDestinations
                onOpenSearch={() => {
                  setViewMode('order');
                  setPickerType('destination');
                }}
                onSelectLandmark={handleSelectQuickLandmark}
              />
            </div>
          ) : (
            /* VUE COMMANDE DE COURSE (Depuis, Où allez-vous, Véhicules, Tarifs) */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-base font-black text-slate-900">Commander une course</h2>
                <button
                  type="button"
                  onClick={() => setViewMode('hub')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Tous les services
                </button>
              </div>

              {/* Boîte d'adresses Depuis / Destination */}
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
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

              {errorMessage && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isEstimating && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-instar-secondary" />
                  <span>Calcul de l'itinéraire optimal...</span>
                </div>
              )}

              <VehicleSelector
                selectedType={vehicleType}
                onSelect={setVehicleType}
                estimates={estimateData?.estimates || []}
                estimatedDurationMin={estimateData?.estimatedDurationMin || 5}
              />

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

              <div className="pt-3">
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
                    : 'Choisissez votre destination'}
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* Zone de carte interactive plein écran */}
        <section className="flex-1 relative h-full hidden md:block">
          <GagnoaMapVisual pickup={pickup} destination={destination} />
        </section>
      </main>

      {/* 3. Tiroir sélecteur de repères géographiques */}
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
            setViewMode('order');
          }
        }}
      />
    </div>
  );
}
