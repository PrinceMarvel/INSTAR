/**
 * Écran de surveillance de la flotte de Gagnoa pour l'administration INSTAR.
 * Répertorie tous les conducteurs avec leur statut en direct, courses et notes.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import apiClient from '../../config/api';
import { formatCFA } from '../../utils/formatters';
import { Search, Bike, Car, Star, ArrowLeft, AlertCircle } from 'lucide-react';

export default function FleetMonitorScreen({ onBack }) {
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('ALL'); // 'ALL' | 'MOTO_TAXI' | 'COMMUNAL_TAXI'
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchFleet = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/admin/drivers');
      setDrivers(response.data.data || []);
    } catch (err) {
      setErrorMessage('Impossible de charger la flotte des chauffeurs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFleet();
  }, [fetchFleet]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phoneNumber.includes(searchQuery) ||
        (driver.licensePlate && driver.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesVehicle = vehicleFilter === 'ALL' || driver.vehicleType === vehicleFilter;

      return matchesSearch && matchesVehicle;
    });
  }, [drivers, searchQuery, vehicleFilter]);

  return (
    <div className="space-y-4 text-left">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-instar-text hover:text-instar-text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tableau de bord</span>
        </button>

        <span className="text-xs font-bold text-instar-text">
          {filteredDrivers.length} chauffeur(s)
        </span>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-instar-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, téléphone, plaque..."
            className="w-full bg-instar-surface text-instar-text text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none border border-instar-border focus:border-instar-border-active"
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'MOTO_TAXI', 'COMMUNAL_TAXI'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setVehicleFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                vehicleFilter === type
                  ? 'bg-instar-secondary text-instar-text shadow-sm'
                  : 'bg-instar-surface-alt text-instar-text-muted hover:text-instar-text'
              }`}
            >
              {type === 'ALL' && 'Tous'}
              {type === 'MOTO_TAXI' && 'Motos-taxis'}
              {type === 'COMMUNAL_TAXI' && 'Taxis'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-instar-text-muted">
          Chargement de la flotte de Gagnoa...
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="py-10 text-center text-xs text-instar-text-muted">
          Aucun chauffeur ne correspond à vos filtres.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredDrivers.map((driver) => (
            <Card key={driver._id} className="p-3.5 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-instar-surface-alt flex items-center justify-center font-bold text-instar-text">
                    {driver.vehicleType === 'MOTO_TAXI' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-instar-text text-xs">{driver.fullName}</h4>
                    <span className="text-[10px] text-instar-text-muted block font-mono">
                      {driver.licensePlate || '—'}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    driver.status === 'AVAILABLE' ? 'success' : driver.status === 'BUSY' ? 'warning' : 'neutral'
                  }
                  dot
                >
                  {driver.status === 'AVAILABLE' ? 'En ligne' : driver.status === 'BUSY' ? 'En course' : 'Hors ligne'}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-instar-border text-instar-text-muted">
                <span>{driver.totalRides || 0} course(s)</span>
                <span className="font-bold text-instar-text">{formatCFA(driver.dailyEarnings || 0)} auj.</span>
                <span className="inline-flex items-center gap-1 font-bold text-yellow-800 bg-yellow-100 px-1.5 py-0.2 rounded text-[10px]">
                  <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                  <span>{driver.averageRating?.toFixed(1) || '5.0'}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
