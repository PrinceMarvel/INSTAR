/**
 * Écran de Connexion unifié de l'application INSTAR.
 * Bascule instantanée entre Passager, Chauffeur et Administrateur.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PhoneInput from '../components/ui/PhoneInput';
import Card from '../components/ui/Card';
import { Eye, EyeOff, ShieldCheck, Car, User, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginScreen({ onNavigate }) {
  const { loginMobile, loginAdmin } = useAuth();

  const [activeRole, setActiveRole] = useState('PASSENGER'); // 'PASSENGER' | 'DRIVER' | 'ADMIN'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (activeRole === 'ADMIN') {
        if (!email.trim() || !password) {
          throw new Error('Veuillez renseigner votre e-mail et mot de passe.');
        }
        await loginAdmin(email, password);
      } else {
        if (!phoneNumber.trim() || !password) {
          throw new Error('Veuillez renseigner votre numéro de téléphone et mot de passe.');
        }
        await loginMobile(phoneNumber, password, activeRole);
      }

      if (onNavigate) {
        onNavigate('home');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message || 'Échec de la connexion.';
      setErrorMessage(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="instar-screen justify-center py-8">
      {/* Logo & En-tête officiel */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-instar-secondary shadow-instar-action mb-3">
          <span className="text-2xl font-black text-instar-text tracking-wider">IN</span>
        </div>
        <h1 className="text-2xl font-black text-instar-text tracking-tight">INSTAR</h1>
        <p className="text-xs text-instar-text-muted mt-1 font-medium">
          L’Ange de la route, rapide et sécurisée à Gagnoa
        </p>
      </div>

      <Card className="w-full">
        {/* Onglets de sélection du rôle */}
        <div className="grid grid-cols-3 gap-1 bg-instar-surface-alt p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => { setActiveRole('PASSENGER'); setErrorMessage(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeRole === 'PASSENGER'
                ? 'bg-instar-surface text-instar-text shadow-sm'
                : 'text-instar-text-muted hover:text-instar-text'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Passager</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('DRIVER'); setErrorMessage(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeRole === 'DRIVER'
                ? 'bg-instar-surface text-instar-text shadow-sm'
                : 'text-instar-text-muted hover:text-instar-text'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Chauffeur</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('ADMIN'); setErrorMessage(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeRole === 'ADMIN'
                ? 'bg-instar-surface text-instar-text shadow-sm'
                : 'text-instar-text-muted hover:text-instar-text'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Message d'erreur alertant */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-instar-danger text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeRole === 'ADMIN' ? (
            <Input
              label="Adresse e-mail administrateur"
              type="email"
              placeholder="admin@instar.ci"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          ) : (
            <PhoneInput
              label="Numéro de téléphone"
              value={phoneNumber}
              onChange={setPhoneNumber}
              required
            />
          )}

          <div className="relative">
            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-instar-text-muted hover:text-instar-text p-1"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            className="mt-2"
          >
            Se connecter
          </Button>
        </form>

        {/* Liens de redirection vers l'inscription */}
        {activeRole !== 'ADMIN' && (
          <div className="pt-4 mt-4 border-t border-instar-border text-center text-xs text-instar-text-muted">
            {activeRole === 'PASSENGER' ? (
              <p>
                Nouveau sur INSTAR ?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('register_passenger')}
                  className="font-bold text-instar-text hover:underline"
                >
                  Créer un compte passager
                </button>
              </p>
            ) : (
              <p>
                Vous possédez une moto ou un taxi ?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('register_driver')}
                  className="font-bold text-instar-text hover:underline"
                >
                  Rejoindre la flotte INSTAR
                </button>
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
