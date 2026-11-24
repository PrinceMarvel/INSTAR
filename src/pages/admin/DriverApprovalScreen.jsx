/**
 * Écran de modération et d'approbation des chauffeurs pour l'administration INSTAR.
 * Permet de vérifier les pièces d'un conducteur et d'activer son compte sur le réseau.
 */

import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import apiClient from '../../config/api';
import { formatDateShortFr } from '../../utils/formatters';
import { Bike, Car, Check, X, ShieldAlert, Phone, AlertCircle, ArrowLeft } from 'lucide-react';

export default function DriverApprovalScreen({ onBack }) {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPendingDrivers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/admin/drivers/pending');
      setPendingDrivers(response.data.data || []);
    } catch (err) {
      setErrorMessage('Échec du chargement des dossiers en attente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingDrivers();
  }, [fetchPendingDrivers]);

  const handleApproval = async (driverId, isApproved) => {
    setActionId(driverId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiClient.patch(`/admin/drivers/${driverId}/approve`, { isApproved });
      setSuccessMessage(
        isApproved
          ? 'Compte chauffeur activé avec succès sur le réseau INSTAR.'
          : 'Dossier chauffeur refusé.'
      );
      fetchPendingDrivers();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Échec de l’opération.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* En-tête avec retour */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-instar-text hover:text-instar-text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tableau de bord</span>
        </button>

        <Badge variant="warning">
          {pendingDrivers.length} dossier(s) en attente
        </Badge>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-instar-text-muted">
          Chargement des dossiers soumis...
        </div>
      ) : pendingDrivers.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-instar-success mx-auto flex items-center justify-center font-bold">
            ✓
          </div>
          <h3 className="font-bold text-instar-text text-sm">Tous les dossiers sont traités</h3>
          <p className="text-xs text-instar-text-muted max-w-xs mx-auto">
            Aucun nouveau chauffeur de Gagnoa n’est actuellement en attente de vérification.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {pendingDrivers.map((driver) => (
            <Card key={driver._id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-instar-secondary/20 flex items-center justify-center font-bold text-instar-text">
                    {driver.vehicleType === 'MOTO_TAXI' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-instar-text text-sm">{driver.fullName}</h4>
                    <span className="text-[11px] text-instar-text-muted block">
                      Inscrit le {formatDateShortFr(driver.createdAt)}
                    </span>
                  </div>
                </div>

                <Badge variant="accent">
                  {driver.vehicleType === 'MOTO_TAXI' ? 'Moto-taxi' : 'Taxi communal'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-instar-surface-alt p-2.5 rounded-xl">
                <div>
                  <span className="text-instar-text-muted text-[10px] block">Téléphone</span>
                  <span className="font-semibold text-instar-text">{driver.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-instar-text-muted text-[10px] block">Immatriculation / Registre</span>
                  <span className="font-mono font-bold text-instar-text">{driver.licensePlate}</span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={actionId === driver._id}
                  onClick={() => handleApproval(driver._id, false)}
                  className="text-instar-danger hover:bg-red-50 border-red-200"
                >
                  <X className="w-4 h-4 mr-1" />
                  <span>Refuser</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  isLoading={actionId === driver._id}
                  onClick={() => handleApproval(driver._id, true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                >
                  <Check className="w-4 h-4 mr-1" />
                  <span>Approuver</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
