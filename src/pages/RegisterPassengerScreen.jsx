/**
 * Écran d'Inscription Passager de l'application INSTAR.
 * Intègre la sélection d'indicatif international avec drapeaux pour tous les voyageurs.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PhoneInput from '../components/ui/PhoneInput';
import Card from '../components/ui/Card';
import { User, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function RegisterPassengerScreen({ onNavigate }) {
  const { registerPassenger } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

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
      await registerPassenger({
        fullName,
        phoneNumber,
        password,
      });

      if (onNavigate) {
        onNavigate('home');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Échec de l’inscription.';
      setErrorMessage(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="instar-screen justify-center py-6">
      {/* Bouton retour vers la connexion */}
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
        <h1 className="text-xl font-black text-instar-text tracking-tight">Compte Passager</h1>
        <p className="text-xs text-instar-text-muted mt-1">
          Commandez vos motos-taxis et taxis à Gagnoa en toute sérénité
        </p>
      </div>

      <Card className="w-full">
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom complet"
            placeholder="Ex : Koffi Kouassi Ange"
            icon={User}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <PhoneInput
            label="Numéro de téléphone mobile"
            value={phoneNumber}
            onChange={setPhoneNumber}
            helperText="Accessible aux numéros ivoiriens et internationaux."
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
            placeholder="Confirmez votre mot de passe"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            className="mt-2"
          >
            Créer mon compte
          </Button>
        </form>

        <div className="pt-4 mt-4 border-t border-instar-border text-center text-xs text-instar-text-muted">
          <p>
            Vous avez déjà un compte ?{' '}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('login')}
              className="font-bold text-instar-text hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
