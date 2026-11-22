/**
 * Boîte modale de reçu numérique officiel pour INSTAR.
 * Présente le justificatif complet de la course acquittée avec estampille de validation.
 */

import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import apiClient from '../../config/api';
import { formatCFA, formatDateFr, formatDistance } from '../../utils/formatters';
import { CheckCircle2, MapPin, Receipt, ShieldCheck, Printer } from 'lucide-react';

export default function RideReceiptModal({ isOpen, onClose, rideId }) {
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchReceipt = async () => {
      if (!rideId || !isOpen) return;
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/payments/receipt/${rideId}`);
        if (isMounted) {
          setReceipt(response.data.data);
        }
      } catch (err) {
        // Gestion discrète de l'erreur
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReceipt();

    return () => {
      isMounted = false;
    };
  }, [rideId, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reçu officiel de course">
      {isLoading ? (
        <div className="py-8 text-center text-xs text-instar-text-muted">
          Génération du reçu numérique...
        </div>
      ) : receipt ? (
        <div className="space-y-4 text-left">
          {/* Estampille d'acquittement */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-instar-success text-instar-primary mx-auto mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-emerald-900 block tracking-wider uppercase">
              Paiement Acquitté
            </span>
            <span className="text-[11px] text-emerald-800 block">
              {receipt.receiptNumber}
            </span>
          </div>

          {/* Détails financiers */}
          <div className="bg-instar-surface-alt rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-instar-border">
              <span className="text-instar-text-muted">Date & Heure</span>
              <span className="font-semibold text-instar-text">{formatDateFr(receipt.issuedAt)}</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-instar-border">
              <span className="text-instar-text-muted">Mode de règlement</span>
              <Badge variant="accent">
                {receipt.financials.paymentMethod === 'CASH' ? 'Espèces' : 'Mobile Money'}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <span className="font-bold text-instar-text">Total réglé</span>
              <span className="font-black text-base text-instar-text">
                {formatCFA(receipt.financials.totalFare)}
              </span>
            </div>
          </div>

          {/* Acteurs du trajet */}
          <div className="text-xs space-y-2 border border-instar-border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-instar-text-muted">Passager</span>
              <span className="font-bold text-instar-text">{receipt.passenger.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-instar-text-muted">Conducteur</span>
              <span className="font-bold text-instar-text">{receipt.driver.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-instar-text-muted">Véhicule & Plaque</span>
              <span className="font-mono text-instar-text">
                {receipt.driver.vehicleType === 'MOTO_TAXI' ? 'Moto-taxi' : 'Taxi'} ({receipt.driver.licensePlate})
              </span>
            </div>
          </div>

          {/* Trajet */}
          <div className="text-xs space-y-1 bg-instar-surface-alt rounded-xl p-3">
            <span className="text-instar-text-muted block text-[10px]">Trajet effectué à Gagnoa</span>
            <span className="font-bold text-instar-text block">
              {receipt.trip.pickup} ➔ {receipt.trip.destination}
            </span>
            <span className="text-instar-text-muted block text-[11px]">
              Distance : {formatDistance(receipt.trip.distanceKm)}
            </span>
          </div>

          <Button variant="secondary" fullWidth size="md" onClick={onClose}>
            Fermer le reçu
          </Button>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-instar-danger">
          Reçu indisponible pour cette course.
        </div>
      )}
    </Modal>
  );
}
