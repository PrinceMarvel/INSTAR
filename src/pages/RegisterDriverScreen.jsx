/**
 * Écran d'Inscription Chauffeur de l'application INSTAR.
 * Sélection visuelle du véhicule (Moto-taxi vs Taxi communal) et saisie du téléphone international.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PhoneInput from '../components/ui/PhoneInput';
import Card from '../components/ui/Card';
import { User, Lock, Bike, Car, ArrowLeft, AlertCircle, Info } from 'lucide-react';

export default function RegisterDriverScreen({ onNavigate }) {
  const { registerDriver } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('MOTO_TAXI'); // 'MOTO_TAXI' | 'COMMUNAL_TAXI'
  const [licensePlate, setLicensePlate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessInfo('');

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerDriver({
        fullName,
        phoneNumber,
        vehicleType,
        licensePlate,
        password,
      });

      setSuccessInfo(
        response.message || 'Votre dossier a été soumis. L’administration INSTAR validera votre compte rapidement.'
      );
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Échec de l’inscription chauffeur.';
      setErrorMessage(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="instar-screen justify-center py-6">
      {/* Bouton retour */}
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-instar-text hover:text-instar-text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la connexion</span>
        </button>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-xl font-black text-instar-text tracking-tight">Espace Chauffeur</h1>
        <p className="text-xs text-instar-text-muted mt-1">
          Rejoignez le réseau professionnel de transport urbain de Gagnoa
        </p>
      </div>

      <Card className="w-full">
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successInfo ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-instar-secondary mx-auto flex items-center justify-center font-bold">
              ✓
            </div>
            <h3 className="font-bold text-instar-text text-sm">Inscription enregistrée !</h3>
            <p className="text-xs text-instar-text-muted leading-relaxed">{successInfo}</p>
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={() => onNavigate && onNavigate('login')}
            >
              Retour à l’accueil
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom complet du conducteur"
              placeholder="Ex : Yao Konan Bertin"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <PhoneInput
              label="Numéro de téléphone mobile"
              value={phoneNumber}
              onChange={setPhoneNumber}
              helperText="Votre numéro servira pour vous connecter et recevoir les alertes."
              required
            />

            {/* Sélecteur visuel du type de véhicule */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-instar-text tracking-wide block">
                Type de véhicule de transport <span className="text-instar-danger">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVehicleType('MOTO_TAXI')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                    vehicleType === 'MOTO_TAXI'
                      ? 'border-instar-secondary bg-instar-secondary/15 font-bold shadow-sm'
                      : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
                  }`}
                >
                  <Bike className="w-6 h-6 mb-1 text-instar-text" />
                  <span className="text-xs">Moto-taxi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType('COMMUNAL_TAXI')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                    vehicleType === 'COMMUNAL_TAXI'
                      ? 'border-instar-secondary bg-instar-secondary/15 font-bold shadow-sm'
                      : 'border-instar-border bg-instar-surface hover:bg-instar-surface-alt'
                  }`}
                >
                  <Car className="w-6 h-6 mb-1 text-instar-text" />
                  <span className="text-xs">Taxi communal</span>
                </button>
              </div>
            </div>

            <Input
              label="Numéro d’immatriculation ou registre"
              placeholder="Ex : 1234 GH 01 ou N° de registre"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Minimum 6 caractères"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Confirmez le mot de passe"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Note d'information */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-instar-surface-alt text-instar-text-muted text-[11px] leading-relaxed">
              <Info className="w-4 h-4 shrink-0 text-instar-text mt-0.5" />
              <span>
                Conformément aux règles de sécurité de la plateforme, votre compte sera activé après vérification par les modérateurs de Gagnoa.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="mt-2"
            >
              Soumettre mon dossier
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
