/**
 * Sélecteur de repères géographiques officiel de la ville de Gagnoa.
 * Permet au passager de choisir son point de départ ou sa destination parmi les quartiers phares.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Search, X, Navigation } from 'lucide-react';
import apiClient from '../../config/api';

// Repères de secours au cas où le serveur est en cours de démarrage
const FALLBACK_LANDMARKS = [
  { landmarkId: 'garahio', name: 'Garahio', description: 'Carrefour principal et quartier historique', location: { coordinates: [-5.9525, 6.1319] } },
  { landmarkId: 'dokui', name: 'Dokui', description: 'Zone résidentielle et commerciale de Dokui', location: { coordinates: [-5.9412, 6.1385] } },
  { landmarkId: 'grand_marche', name: 'Grand Marché', description: 'Cœur économique et commercial de Gagnoa', location: { coordinates: [-5.9501, 6.1302] } },
  { landmarkId: 'dioulabougou', name: 'Dioulabougou', description: 'Quartier central très animé et accessible', location: { coordinates: [-5.9482, 6.1264] } },
  { landmarkId: 'babre', name: 'Babré', description: 'Zone urbaine et carrefour stratégique', location: { coordinates: [-5.9578, 6.1245] } },
  { landmarkId: 'soleil', name: 'Quartier Soleil', description: 'Secteur dynamique résidentiel et étudiant', location: { coordinates: [-5.9621, 6.1354] } },
];

export default function LandmarkPicker({
  isOpen,
  onClose,
  onSelect,
  title = 'Choisir un lieu à Gagnoa',
  currentValue = null,
}) {
  const [landmarks, setLandmarks] = useState(FALLBACK_LANDMARKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLandmarks = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/landmarks');
        if (isMounted && response.data?.data && response.data.data.length > 0) {
          setLandmarks(response.data.data);
        }
      } catch (err) {
        // En cas d'erreur de réseau, conservation transparente des repères de secours
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchLandmarks();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const filteredLandmarks = useMemo(() => {
    if (!searchQuery.trim()) return landmarks;
    const query = searchQuery.toLowerCase().trim();
    return landmarks.filter(
      (l) => l.name.toLowerCase().includes(query) || (l.description && l.description.toLowerCase().includes(query))
    );
  }, [landmarks, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Fond flouté */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-instar-surface rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-instar-border max-h-[85vh] flex flex-col text-left">
        {/* En-tête du sélecteur */}
        <div className="flex items-center justify-between pb-3 border-b border-instar-border mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-instar-secondary/20 flex items-center justify-center text-instar-text">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-instar-text text-sm">{title}</h3>
              <p className="text-[11px] text-instar-text-muted">Repères officiels de Gagnoa</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-instar-text-muted hover:text-instar-text hover:bg-instar-surface-alt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-3 text-instar-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher (ex : Garahio, Marché, Dokui)..."
            className="w-full bg-instar-surface-alt text-instar-text text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none border border-instar-border focus:border-instar-border-active"
            autoFocus
          />
        </div>

        {/* Liste des repères */}
        <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
          {filteredLandmarks.map((landmark) => {
            const isSelected = currentValue?.landmarkId === landmark.landmarkId;

            return (
              <button
                key={landmark.landmarkId}
                type="button"
                onClick={() => {
                  onSelect(landmark);
                  onClose();
                }}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-instar-secondary bg-instar-secondary/10 shadow-sm'
                    : 'border-transparent hover:bg-instar-surface-alt hover:border-instar-border'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-instar-secondary text-instar-text font-bold'
                      : 'bg-instar-surface-alt text-instar-text-muted'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-instar-text text-sm">{landmark.name}</span>
                    {isSelected && (
                      <span className="text-[11px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
                        Sélectionné
                      </span>
                    )}
                  </div>
                  {landmark.description && (
                    <p className="text-xs text-instar-text-muted mt-0.5 truncate">{landmark.description}</p>
                  )}
                </div>
              </button>
            );
          })}

          {filteredLandmarks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs text-instar-text-muted">Aucun repère ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
