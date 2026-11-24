/**
 * Écran de réglage dynamique des commissions pour l'administration INSTAR.
 * Permet au Super Admin d'ajuster le taux sans toucher au code source.
 */

import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import apiClient from '../../config/api';
import { Percent, ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CommissionSettingsScreen({ initialRate = 10, onBack }) {
  const [commissionRate, setCommissionRate] = useState(initialRate);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const numericRate = parseFloat(commissionRate);
    if (isNaN(numericRate) || numericRate < 0 || numericRate > 50) {
      setErrorMessage('Le taux de commission doit être compris entre 0% et 50%.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.patch('/admin/commission', {
        commissionPercentage: numericRate,
      });

      const updated = response.data.data;
      setCommissionRate(updated.commissionPercentage);
      setSuccessMessage(
        `Le nouveau taux de commission de l’application est fixé à ${updated.commissionPercentage}%.`
      );
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Échec de la mise à jour des commissions.');
    } finally {
      setIsLoading(false);
    }
  };

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

        <span className="text-xs font-bold text-instar-text">Paramètres financiers</span>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-instar-secondary/20 flex items-center justify-center font-bold text-instar-text shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-instar-text text-sm">Commission sur les courses</h3>
            <p className="text-xs text-instar-text-muted mt-0.5 leading-relaxed">
              Pourcentage prélevé par l’application sur chaque course réalisée à Gagnoa (les chauffeurs perçoivent le reste).
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-instar-text">Taux de commission (%)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full bg-instar-surface-alt text-instar-text font-black text-lg rounded-xl px-4 py-3 border border-instar-border focus:border-instar-border-active outline-none"
                required
              />
              <span className="absolute right-4 top-3.5 font-black text-instar-text-muted">%</span>
            </div>
            <p className="text-[11px] text-instar-text-muted mt-1">
              Part chauffeur correspondante : <strong className="text-instar-text">{100 - Number(commissionRate || 0)}%</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-instar-surface-alt text-xs text-instar-text-muted space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-instar-text">
              <ShieldCheck className="w-4 h-4 text-instar-secondary" />
              <span>Application immédiate</span>
            </div>
            <p>
              Toute modification enregistrée prend effet immédiatement pour toutes les prochaines courses de Gagnoa sans nécessiter de redémarrage.
            </p>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading}>
            Enregistrer le nouveau barème
          </Button>
        </form>
      </Card>
    </div>
  );
}
