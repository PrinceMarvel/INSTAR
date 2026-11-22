/**
 * Boîte modale de paiement automatique pour INSTAR.
 * Validation instantanée sans capture d'écran (Espèces ou Mobile Money / Wave).
 */

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import apiClient from '../../config/api';
import { formatCFA } from '../../utils/formatters';
import { Banknote, Smartphone, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

const OPERATORS = [
  { id: 'WAVE', name: 'Wave', badge: 'Sans frais' },
  { id: 'ORANGE_MONEY', name: 'Orange Money', badge: 'Côte d’Ivoire' },
  { id: 'MTN_MOMO', name: 'MTN MoMo', badge: 'Instantané' },
];

export default function PaymentModal({
  isOpen,
  onClose,
  rideId,
  amount,
  defaultPaymentMethod = 'CASH',
  onPaymentSuccess,
}) {
  const [paymentMethod, setPaymentMethod] = useState(defaultPaymentMethod);
  const [selectedOperator, setSelectedOperator] = useState('WAVE');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcessPayment = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        rideId,
        paymentMethod,
        operator: paymentMethod === 'MOBILE_MONEY' ? selectedOperator : undefined,
        customerPhone: paymentMethod === 'MOBILE_MONEY' ? (customerPhone || '0708091011') : undefined,
      };

      await apiClient.post('/payments/process', payload);

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Échec de validation du paiement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Règlement de votre course"
      subtitle={`Montant total officiel : ${formatCFA(amount)}`}
    >
      <div className="space-y-4">
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sélection Mode : Espèces vs Mobile Money */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('CASH')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
              paymentMethod === 'CASH'
                ? 'border-instar-secondary bg-instar-secondary/15 font-bold shadow-sm'
                : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
            }`}
          >
            <Banknote className="w-5 h-5 text-instar-text" />
            <div>
              <span className="text-xs block">En espèces</span>
              <span className="text-[10px] text-instar-text-muted block">Direct au chauffeur</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('MOBILE_MONEY')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
              paymentMethod === 'MOBILE_MONEY'
                ? 'border-instar-secondary bg-instar-secondary/15 font-bold shadow-sm'
                : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
            }`}
          >
            <Smartphone className="w-5 h-5 text-instar-text" />
            <div>
              <span className="text-xs block">Mobile Money</span>
              <span className="text-[10px] text-instar-text-muted block">Automatique</span>
            </div>
          </button>
        </div>

        {/* Formulaire Mobile Money automatique */}
        {paymentMethod === 'MOBILE_MONEY' ? (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-instar-text block">Sélectionnez votre opérateur</label>
            <div className="grid grid-cols-3 gap-2">
              {OPERATORS.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setSelectedOperator(op.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedOperator === op.id
                      ? 'border-instar-secondary bg-instar-secondary/20 font-bold'
                      : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
                  }`}
                >
                  <span className="text-xs block text-instar-text">{op.name}</span>
                  <span className="text-[9px] text-instar-text-muted block">{op.badge}</span>
                </button>
              ))}
            </div>

            <Input
              label="Numéro de débit Mobile Money"
              placeholder="Ex : 0708091011"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              helperText="Débit automatique sans capture d’écran requise."
            />
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-yellow-900 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-yellow-800" />
            <span>
              Remettez <strong className="font-bold">{formatCFA(amount)}</strong> en espèces au chauffeur. La validation sera automatique et la commission déduite de son portefeuille.
            </span>
          </div>
        )}

        {/* Sécurité garantie */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-instar-text-muted pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-instar-success" />
          <span>Paiement sécurisé par la plateforme officielle INSTAR</span>
        </div>

        <Button
          type="button"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={isLoading}
          onClick={handleProcessPayment}
        >
          {paymentMethod === 'CASH'
            ? 'Confirmer le règlement en espèces'
            : `Valider le paiement (${formatCFA(amount)})`}
        </Button>
      </div>
    </Modal>
  );
}
