/**
 * Sélecteur comparatif de véhicules façon Yango (Éco / Confort / Moto).
 * Présente le Moto-taxi et le Taxi communal de Gagnoa avec tarification transparente.
 */

import React from 'react';
import { Bike, Car, Info, Clock, Check } from 'lucide-react';
import { formatCFA } from '../../utils/formatters';

export default function VehicleSelector({
  selectedType = 'MOTO_TAXI',
  onSelect,
  estimates = [],
  estimatedDurationMin = 5,
}) {
  const motoEstimate = estimates.find((e) => e.vehicleType === 'MOTO_TAXI');
  const taxiEstimate = estimates.find((e) => e.vehicleType === 'COMMUNAL_TAXI');

  const options = [
    {
      id: 'MOTO_TAXI',
      title: 'Moto-taxi',
      badge: 'Rapide',
      icon: Bike,
      duration: `~${estimatedDurationMin} min`,
      fare: motoEstimate ? motoEstimate.fare : 200,
      hasEstimate: Boolean(motoEstimate),
    },
    {
      id: 'COMMUNAL_TAXI',
      title: 'Taxi Confort',
      badge: 'Confort',
      icon: Car,
      duration: `~${Math.ceil(estimatedDurationMin * 1.2)} min`,
      fare: taxiEstimate ? taxiEstimate.fare : 300,
      hasEstimate: Boolean(taxiEstimate),
    },
  ];

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-xs font-bold text-instar-text uppercase tracking-wider">
          Moyen de transport
        </span>
        <span className="text-[11px] text-instar-text-muted flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>Tarif garanti</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedType === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-black bg-white ring-2 ring-black shadow-md'
                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
              }`}
            >
              {/* Badge supérieur */}
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-instar-secondary text-instar-text'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {opt.badge}
                </span>

                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Visuel du véhicule */}
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-2">
                <Icon className="w-6 h-6" />
              </div>

              {/* Titre & Informations de prix */}
              <div>
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  {opt.title}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{opt.duration}</span>
                </span>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline gap-1">
                  <span className="text-sm font-black text-slate-900">
                    {formatCFA(opt.fare)}
                  </span>
                  {!opt.hasEstimate && (
                    <span className="text-[10px] text-slate-400 font-medium">dès</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
