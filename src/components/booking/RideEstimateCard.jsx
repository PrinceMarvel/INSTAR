/**
 * Carte récapitulative d'estimation de course pour INSTAR.
 * Affiche l'itinéraire, le calcul de distance, le prix garanti et le mode de règlement.
 */

import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { MapPin, Navigation, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';
import { formatCFA, formatDistance, formatDuration } from '../../utils/formatters';

export default function RideEstimateCard({
  pickup,
  destination,
  distanceKm,
  durationMin,
  fare,
  paymentMethod = 'CASH',
  onPaymentMethodChange,
}) {
  return (
    <Card className="w-full space-y-4">
      {/* Récapitulatif de l'itinéraire */}
      <div className="space-y-3 pb-3 border-b border-instar-border">
        {/* Point de départ */}
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-instar-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-instar-secondary" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-instar-text-muted block">Point de départ</span>
            <span className="text-sm font-bold text-instar-text truncate block">
              {pickup?.name || 'Sélectionner le départ'}
            </span>
          </div>
        </div>

        {/* Ligne de liaison */}
        <div className="ml-3 pl-3 border-l-2 border-dashed border-instar-border h-2" />

        {/* Point de destination */}
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-instar-text/10 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-instar-text" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-instar-text-muted block">Destination</span>
            <span className="text-sm font-bold text-instar-text truncate block">
              {destination?.name || 'Sélectionner la destination'}
            </span>
          </div>
        </div>
      </div>

      {/* Métriques du trajet */}
      <div className="grid grid-cols-3 gap-2 py-1 text-center bg-instar-surface-alt rounded-xl p-2.5">
        <div>
          <span className="text-[10px] text-instar-text-muted font-medium block">Distance</span>
          <span className="text-xs font-bold text-instar-text">{formatDistance(distanceKm)}</span>
        </div>
        <div className="border-x border-instar-border">
          <span className="text-[10px] text-instar-text-muted font-medium block">Durée</span>
          <span className="text-xs font-bold text-instar-text">{formatDuration(durationMin)}</span>
        </div>
        <div>
          <span className="text-[10px] text-instar-text-muted font-medium block">Tarif garanti</span>
          <span className="text-xs font-black text-instar-text">{formatCFA(fare)}</span>
        </div>
      </div>

      {/* Sélection du mode de paiement */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold text-instar-text block">Mode de règlement</span>
        <div className="grid grid-cols-2 gap-2">
          {/* Espèces */}
          <button
            type="button"
            onClick={() => onPaymentMethodChange && onPaymentMethodChange('CASH')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
              paymentMethod === 'CASH'
                ? 'border-instar-secondary bg-instar-secondary/15 font-bold shadow-sm'
                : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
            }`}
          >
            <Banknote className="w-4 h-4 text-instar-text shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs block">Espèces</span>
              <span className="text-[10px] text-instar-text-muted block">Direct au chauffeur</span>
            </div>
            {paymentMethod === 'CASH' && <CheckCircle2 className="w-3.5 h-3.5 text-yellow-800" />}
          </button>

          {/* Mobile Money */}
          <button
            type="button"
            onClick={() => onPaymentMethodChange && onPaymentMethodChange('MOBILE_MONEY')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
              paymentMethod === 'MOBILE_MONEY'
                ? 'border-instar-secondary bg-instar-secondary/15 font-bold shadow-sm'
                : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
            }`}
          >
            <Smartphone className="w-4 h-4 text-instar-text shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs block">Mobile Money</span>
              <span className="text-[10px] text-instar-text-muted block">Wave / Orange / MTN</span>
            </div>
            {paymentMethod === 'MOBILE_MONEY' && <CheckCircle2 className="w-3.5 h-3.5 text-yellow-800" />}
          </button>
        </div>
      </div>
    </Card>
  );
}
