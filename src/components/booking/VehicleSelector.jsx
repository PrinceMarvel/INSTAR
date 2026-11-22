/**
 * Sélecteur comparatif de véhicules pour la réservation INSTAR.
 * Présente le Moto-taxi et le Taxi communal avec leur tarif officiel transparent en FCFA.
 */

import React from 'react';
import { Bike, Car, Clock, Zap } from 'lucide-react';
import { formatCFA } from '../../utils/formatters';

export default function VehicleSelector({
  selectedType = 'MOTO_TAXI',
  onSelect,
  estimates = [],
  estimatedDurationMin = 5,
}) {
  // Extraction des tarifs depuis les estimations
  const motoEstimate = estimates.find((e) => e.vehicleType === 'MOTO_TAXI');
  const taxiEstimate = estimates.find((e) => e.vehicleType === 'COMMUNAL_TAXI');

  return (
    <div className="space-y-2 text-left">
      <label className="text-xs font-bold text-instar-text tracking-wide flex items-center justify-between">
        <span>Choisissez votre moyen de transport</span>
        <span className="text-[11px] font-normal text-instar-text-muted">Tarif officiel transparent</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        {/* Option Moto-taxi */}
        <button
          type="button"
          onClick={() => onSelect('MOTO_TAXI')}
          className={`relative flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
            selectedType === 'MOTO_TAXI'
              ? 'border-instar-secondary bg-instar-secondary/15 shadow-sm ring-1 ring-instar-secondary'
              : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
          }`}
        >
          {/* Badge avantage */}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-800 bg-yellow-200/80 px-2 py-0.5 rounded-md w-fit mb-2">
            <Zap className="w-2.5 h-2.5" />
            <span>Plus rapide</span>
          </span>

          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-instar-surface flex items-center justify-center text-instar-text shadow-sm border border-instar-border">
              <Bike className="w-5 h-5" />
            </div>
            <span className="text-base font-black text-instar-text">
              {motoEstimate ? formatCFA(motoEstimate.fare) : '—'}
            </span>
          </div>

          <span className="font-bold text-instar-text text-xs">Moto-taxi</span>
          <span className="flex items-center gap-1 text-[11px] text-instar-text-muted mt-0.5">
            <Clock className="w-3 h-3" />
            <span>~{estimatedDurationMin} min</span>
          </span>
        </button>

        {/* Option Taxi communal */}
        <button
          type="button"
          onClick={() => onSelect('COMMUNAL_TAXI')}
          className={`relative flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
            selectedType === 'COMMUNAL_TAXI'
              ? 'border-instar-secondary bg-instar-secondary/15 shadow-sm ring-1 ring-instar-secondary'
              : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
          }`}
        >
          {/* Badge confort */}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-md w-fit mb-2">
            <span>Confortable</span>
          </span>

          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-instar-surface flex items-center justify-center text-instar-text shadow-sm border border-instar-border">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-base font-black text-instar-text">
              {taxiEstimate ? formatCFA(taxiEstimate.fare) : '—'}
            </span>
          </div>

          <span className="font-bold text-instar-text text-xs">Taxi communal</span>
          <span className="flex items-center gap-1 text-[11px] text-instar-text-muted mt-0.5">
            <Clock className="w-3 h-3" />
            <span>~{Math.ceil(estimatedDurationMin * 1.2)} min</span>
          </span>
        </button>
      </div>
    </div>
  );
}
