/**
 * Écran du Portefeuille Virtuel (Wallet) du Chauffeur INSTAR.
 * Suivi en direct du solde, des gains cumulés et de la déduction des commissions (10%).
 */

import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import apiClient from '../../config/api';
import { formatCFA, formatDateFr } from '../../utils/formatters';
import { Wallet, ArrowLeft, TrendingUp, ArrowDownRight, ArrowUpRight, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DriverWalletScreen({ onNavigate }) {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchWallet = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/drivers/stats');
        if (isMounted) {
          setWalletData(response.data.data);
        }
      } catch (err) {
        // Ignorer si non disponible
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchWallet();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalEarnings = walletData?.totalEarnings || 0;
  // Estimation des commissions versées (10% de base)
  const estimatedCommissions = Math.round(totalEarnings * 0.1);
  const netBalance = Math.round(totalEarnings * 0.9);

  return (
    <div className="instar-screen py-5 space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('driver_dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-instar-text hover:text-instar-text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tableau de bord</span>
        </button>

        <h1 className="text-sm font-bold text-instar-text">Mon Portefeuille</h1>
      </div>

      {/* Carte principale de solde */}
      <Card className="bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-950 p-6 rounded-3xl shadow-instar-action space-y-4 border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Solde Virtuel Net</span>
          </div>
          <Badge variant="accent" className="bg-black/15 text-yellow-950 border-0 font-bold">
            90% Revenu
          </Badge>
        </div>

        <div>
          <span className="text-3xl font-black block tracking-tight">
            {formatCFA(netBalance)}
          </span>
          <span className="text-[11px] opacity-80 block mt-1">
            Disponible pour encaissement ou déduction de commissions
          </span>
        </div>
      </Card>

      {/* Métriques d'activité financière */}
      <div className="grid grid-cols-2 gap-3 text-left">
        <Card className="space-y-1">
          <div className="flex items-center justify-between text-instar-text-muted">
            <span className="text-[11px] font-semibold">Total Brut Trajets</span>
            <TrendingUp className="w-3.5 h-3.5 text-instar-success" />
          </div>
          <span className="text-base font-black text-instar-text block">
            {formatCFA(totalEarnings)}
          </span>
          <span className="text-[10px] text-instar-text-muted block">
            {walletData?.totalRides || 0} course(s)
          </span>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between text-instar-text-muted">
            <span className="text-[11px] font-semibold">Commissions App (10%)</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-yellow-700" />
          </div>
          <span className="text-base font-black text-instar-text block">
            {formatCFA(estimatedCommissions)}
          </span>
          <span className="text-[10px] text-instar-text-muted block">
            Reversement automatique
          </span>
        </Card>
      </div>

      {/* Note de transparence sur les commissions en espèces */}
      <div className="p-4 rounded-2xl bg-instar-surface-alt border border-instar-border space-y-2 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-instar-text">
          <ShieldCheck className="w-4 h-4 text-instar-secondary" />
          <span>Règle de commissionnement transparente</span>
        </div>
        <p className="text-[11px] text-instar-text-muted leading-relaxed">
          Lors des règlements en espèces, vous gardez 100% de l’argent physique en main. La commission de 10% d’INSTAR est débitée de ce portefeuille virtuel. Veillez à maintenir un solde positif.
        </p>
      </div>

      {/* Bouton de retour */}
      <Button
        variant="secondary"
        fullWidth
        size="md"
        onClick={() => onNavigate && onNavigate('driver_dashboard')}
      >
        Retour aux courses
      </Button>
    </div>
  );
}
