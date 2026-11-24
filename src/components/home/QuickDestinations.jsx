/**
 * Barre de recherche arrondie, repères fréquents et bannières d'offres pour INSTAR.
 * Inspiré de la mise en page Yango (recherche instantanée + suggestions de lieux + cartes promos).
 */

import React from 'react';
import { Search, ArrowRight, MapPin, Building2, GraduationCap, ShieldCheck, Tag } from 'lucide-react';

const SUGGESTED_LANDMARKS = [
  {
    id: 'grand_marche',
    name: 'Grand Marché de Gagnoa',
    area: 'Cœur économique & commercial',
    time: '3 min',
    icon: Building2,
  },
  {
    id: 'babre',
    name: 'Babré (Lycée & Carrefour)',
    area: 'Zone urbaine Babré',
    time: '5 min',
    icon: GraduationCap,
  },
  {
    id: 'dokui',
    name: 'Dokui',
    area: 'Quartier résidentiel',
    time: '6 min',
    icon: MapPin,
  },
];

export default function QuickDestinations({ onOpenSearch, onSelectLandmark }) {
  return (
    <div className="space-y-5">
      {/* 1. Grande barre de recherche style Pill Yango */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="w-full flex items-center justify-between p-3.5 pl-4 bg-white border border-slate-200/90 rounded-full shadow-sm hover:border-instar-secondary hover:shadow-md transition-all text-left group"
      >
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 group-hover:text-slate-800 transition-colors" />
          <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
            Où allez-vous à Gagnoa ?
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-instar-secondary group-hover:text-slate-900 transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {/* 2. Liste des repères fréquents à Gagnoa */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm divide-y divide-slate-100">
        {SUGGESTED_LANDMARKS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectLandmark(item.id)}
              className="w-full flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-instar-secondary group-hover:text-slate-900 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {item.area}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 pl-2 shrink-0">
                {item.time}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Bannières d'offres et sécurité (Style Yango) */}
      <div className="space-y-2 text-left">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider px-1">
          Bons plans & Sécurité
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Bannière 1 : Prix fixes garantis */}
          <div className="relative p-3.5 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 shadow-sm overflow-hidden flex flex-col justify-between h-36">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase bg-black/15 px-2 py-0.5 rounded-md">
                Garantie INSTAR
              </span>
              <Tag className="w-4 h-4 opacity-75" />
            </div>
            <div>
              <p className="text-base font-black leading-tight tracking-tight">
                Zéro marchandage
              </p>
              <p className="text-[10px] font-semibold opacity-90 mt-1 leading-tight">
                Tarifs fixes officiels dès 200 FCFA dans tout Gagnoa.
              </p>
            </div>
          </div>

          {/* Bannière 2 : Sécurité chauffeurs certifiés */}
          <div className="relative p-3.5 rounded-3xl bg-slate-900 text-white shadow-sm overflow-hidden flex flex-col justify-between h-36">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase bg-white/10 px-2 py-0.5 rounded-md text-instar-secondary">
                100% Vérifié
              </span>
              <ShieldCheck className="w-4 h-4 text-instar-secondary" />
            </div>
            <div>
              <p className="text-base font-black leading-tight text-white tracking-tight">
                Chauffeurs déclarés
              </p>
              <p className="text-[10px] font-medium text-slate-300 mt-1 leading-tight">
                Motos et taxis immatriculés et identifiés par la commune.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
