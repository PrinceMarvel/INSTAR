/**
 * Dashboard Administrateur principal pour INSTAR.
 * Consolide les KPIs exécutifs et permet la navigation vers les écrans de gestion spécialisés.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DriverApprovalScreen from './DriverApprovalScreen';
import FleetMonitorScreen from './FleetMonitorScreen';
import CommissionSettingsScreen from './CommissionSettingsScreen';
import apiClient from '../../config/api';
import { formatCFA } from '../../utils/formatters';
import { ShieldCheck, TrendingUp, Users, Car, Percent, LogOut, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'approvals' | 'fleet' | 'commissions'
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/admin/metrics');
      setMetrics(response.data.data);
    } catch (err) {
      setErrorMessage('Impossible de récupérer les indicateurs de supervision.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (activeTab === 'approvals') {
    return (
      <div className="instar-screen py-5">
        <DriverApprovalScreen onBack={() => { setActiveTab('overview'); fetchMetrics(); }} />
      </div>
    );
  }

  if (activeTab === 'fleet') {
    return (
      <div className="instar-screen py-5">
        <FleetMonitorScreen onBack={() => setActiveTab('overview')} />
      </div>
    );
  }

  if (activeTab === 'commissions') {
    return (
      <div className="instar-screen py-5">
        <CommissionSettingsScreen
          initialRate={metrics?.financials?.currentCommissionRate || 10}
          onBack={() => { setActiveTab('overview'); fetchMetrics(); }}
        />
      </div>
    );
  }

  const kpis = metrics?.kpis || {};
  const financials = metrics?.financials || {};

  return (
    <div className="instar-screen py-5 space-y-4 text-left">
      {/* En-tête Admin */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-instar-secondary shadow-instar-action flex items-center justify-center font-bold text-instar-text">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-1.5 py-0.2 rounded">
                SUPERVISION
              </span>
            </div>
            <h2 className="text-sm font-black text-instar-text truncate max-w-[170px]">
              {user?.fullName || 'Super Admin'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={fetchMetrics}
            aria-label="Actualiser"
            className="p-2 rounded-xl text-instar-text-muted hover:text-instar-text hover:bg-instar-surface-alt transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={logout}
            aria-label="Déconnexion"
            className="p-2 rounded-xl text-instar-text-muted hover:text-instar-text transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Alerte si dossiers en attente */}
      {kpis.pendingDrivers > 0 && (
        <Card
          interactive
          onClick={() => setActiveTab('approvals')}
          className="bg-amber-50 border-amber-200 flex items-center justify-between p-3.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-instar-secondary flex items-center justify-center font-bold text-xs">
              {kpis.pendingDrivers}
            </div>
            <div>
              <span className="text-xs font-bold text-yellow-950 block">Dossiers chauffeurs en attente</span>
              <span className="text-[11px] text-yellow-800 block">Cliquez pour valider les conducteurs</span>
            </div>
          </div>
          <span className="text-xs font-black text-yellow-900">Examiner ➔</span>
        </Card>
      )}

      {/* KPIs Financiers */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="space-y-1 bg-instar-surface">
          <div className="flex items-center justify-between text-instar-text-muted">
            <span className="text-[11px] font-semibold">Commissions App</span>
            <TrendingUp className="w-3.5 h-3.5 text-instar-success" />
          </div>
          <span className="text-lg font-black text-instar-text block">
            {formatCFA(financials.totalCommissions || 0)}
          </span>
          <span className="text-[10px] text-instar-text-muted block">
            Taux actuel : {financials.currentCommissionRate || 10}%
          </span>
        </Card>

        <Card className="space-y-1 bg-instar-surface">
          <div className="flex items-center justify-between text-instar-text-muted">
            <span className="text-[11px] font-semibold">Volume d’affaires</span>
            <span className="text-[10px] font-bold text-instar-text bg-instar-surface-alt px-1.5 py-0.5 rounded">
              BRUT
            </span>
          </div>
          <span className="text-lg font-black text-instar-text block">
            {formatCFA(financials.totalGrossVolume || 0)}
          </span>
          <span className="text-[10px] text-instar-text-muted block">
            {kpis.completedRides || 0} course(s) payée(s)
          </span>
        </Card>
      </div>

      {/* Raccourcis de gestion administrative */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-bold text-instar-text block">Actions de pilotage</span>

        <Card
          interactive
          onClick={() => setActiveTab('approvals')}
          className="flex items-center justify-between p-3.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-instar-surface-alt flex items-center justify-center text-instar-text">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-instar-text block">Validation des chauffeurs</span>
              <span className="text-[10px] text-instar-text-muted block">{kpis.pendingDrivers || 0} en attente</span>
            </div>
          </div>
          <span className="text-xs font-black text-instar-text">Ouvrir ➔</span>
        </Card>

        <Card
          interactive
          onClick={() => setActiveTab('fleet')}
          className="flex items-center justify-between p-3.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-instar-surface-alt flex items-center justify-center text-instar-text">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-instar-text block">Flotte de Gagnoa</span>
              <span className="text-[10px] text-instar-text-muted block">
                {kpis.availableDrivers || 0} en ligne sur {kpis.totalDrivers || 0} inscrits
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-instar-text">Consulter ➔</span>
        </Card>

        <Card
          interactive
          onClick={() => setActiveTab('commissions')}
          className="flex items-center justify-between p-3.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-instar-surface-alt flex items-center justify-center text-instar-text">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-instar-text block">Taux de Commission</span>
              <span className="text-[10px] text-instar-text-muted block">
                Actuellement à {financials.currentCommissionRate || 10}%
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-instar-text">Modifier ➔</span>
        </Card>
      </div>
    </div>
  );
}
