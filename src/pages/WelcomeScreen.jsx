/**
 * Écran d'accueil mobile (Welcome / Onboarding Screen) pour INSTAR.
 * Design inspiré des grandes applications de mobilité (Uber, Yango, Bolt).
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Bike, Car, ShieldCheck, Zap, ArrowRight, ChevronRight, Globe } from 'lucide-react';

export default function WelcomeScreen({ onNavigate }) {
  const { t, currentLanguage, setCurrentLanguage } = useLanguage();

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'fr' ? 'en' : 'fr');
  };

  return (
    <div className="instar-screen min-h-screen justify-between py-6 px-4">
      {/* Barre supérieure discrète : sélecteur de langue */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-instar-surface border border-instar-border shadow-sm text-xs font-bold text-instar-text">
          <span className="w-2 h-2 rounded-full bg-instar-success animate-pulse" />
          <span>Réseau Gagnoa Actif</span>
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-instar-surface border border-instar-border text-xs font-bold text-instar-text hover:bg-instar-surface-alt transition-colors shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-instar-text-muted" />
          <span>{currentLanguage === 'fr' ? '🇨🇮 FR' : '🇬🇧 EN'}</span>
        </button>
      </div>

      {/* Zone Hero : Identité & Marque INSTAR */}
      <div className="my-auto py-6 text-center space-y-5">
        {/* Logo dynamique */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-instar-secondary/30 blur-xl scale-125 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-instar-secondary shadow-instar-action flex items-center justify-center transform active:scale-95 transition-transform">
            <span className="text-3xl font-black text-instar-text tracking-tighter">IN</span>
          </div>
        </div>

        {/* Titre et Slogan officiel */}
        <div>
          <h1 className="text-3xl font-black text-instar-text tracking-tight">INSTAR</h1>
          <p className="text-sm font-semibold text-yellow-800 bg-yellow-100/80 px-3 py-1 rounded-full inline-block mt-1">
            Gagnoa Transport
          </p>
          <p className="text-xs text-instar-text-muted mt-2 max-w-xs mx-auto leading-relaxed">
            {t('slogan')}
          </p>
        </div>

        {/* Cartes d'atouts clés */}
        <div className="grid grid-cols-2 gap-2.5 text-left max-w-sm mx-auto pt-2">
          <div className="p-3 rounded-2xl bg-instar-surface border border-instar-border shadow-sm space-y-1">
            <div className="w-7 h-7 rounded-xl bg-instar-secondary/20 flex items-center justify-center text-instar-text">
              <Bike className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-instar-text block">Motos & Taxis</span>
            <span className="text-[10px] text-instar-text-muted block leading-tight">
              Garahio, Dokui, Grand Marché...
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-instar-surface border border-instar-border shadow-sm space-y-1">
            <div className="w-7 h-7 rounded-xl bg-instar-secondary/20 flex items-center justify-center text-instar-text">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-instar-text block">Tarifs Clairs</span>
            <span className="text-[10px] text-instar-text-muted block leading-tight">
              Dès 200 FCFA, aucun marchandage
            </span>
          </div>
        </div>
      </div>

      {/* Boutons d'actions principaux type application mobile */}
      <div className="space-y-3 w-full max-w-sm mx-auto pt-4">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => onNavigate && onNavigate('register_passenger')}
          className="shadow-instar-action font-black text-base py-4"
        >
          <span className="flex items-center justify-center gap-2">
            <span>Commander un trajet</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>

        <Button
          variant="secondary"
          fullWidth
          size="md"
          onClick={() => onNavigate && onNavigate('login')}
          className="font-bold py-3"
        >
          J’ai déjà un compte
        </Button>

        {/* Liens secondaires : Espace Chauffeur & Administration */}
        <div className="pt-3 border-t border-instar-border flex items-center justify-between text-xs px-1">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('register_driver')}
            className="font-bold text-instar-text hover:text-instar-text-muted inline-flex items-center gap-1"
          >
            <span>Devenir Chauffeur</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('login')}
            className="text-instar-text-muted hover:text-instar-text inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portail Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
