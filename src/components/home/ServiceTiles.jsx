/**
 * Grille des tuiles de services principaux façon Super-App Yango pour INSTAR.
 * Affiche les 4 grands services urbains (Courses, Livraison, Commerces, Interurbain).
 */

import React from 'react';
import { Bike, Car, Package, ShoppingBag, Utensils, Bus, Sparkles, ArrowRight } from 'lucide-react';

export default function ServiceTiles({ onSelectService }) {
  return (
    <div className="space-y-4">
      {/* 1. Grille 2x2 des 4 services phares (Style Yango) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Service 1 : Courses Motos & Taxis (Service principal actif) */}
        <button
          type="button"
          onClick={() => onSelectService('rides')}
          className="relative flex flex-col justify-between p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-instar-secondary transition-all text-left group overflow-hidden h-36"
        >
          {/* Badge temps d'attente */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Gagnoa Direct</span>
            </span>
          </div>

          {/* Illustration visuelle stylisée */}
          <div className="relative my-auto flex items-center justify-end pr-2">
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
              <Bike className="w-8 h-8 text-slate-900" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center -ml-4 -mb-4 shadow-md border-2 border-white">
              <Car className="w-4 h-4 text-instar-secondary" />
            </div>
          </div>

          {/* Titre et tarif d'appel */}
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">Courses</h3>
            <p className="text-[11px] font-bold text-slate-500">Dès 200 F · ~3 min</p>
          </div>
        </button>

        {/* Service 2 : Livraison & Colis express */}
        <button
          type="button"
          onClick={() => onSelectService('delivery')}
          className="relative flex flex-col justify-between p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left group overflow-hidden h-36"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Bientôt
            </span>
          </div>

          <div className="relative my-auto flex items-center justify-end pr-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">Livraison</h3>
            <p className="text-[11px] font-medium text-slate-500">Colis express</p>
          </div>
        </button>

        {/* Service 3 : Magasins & Marché */}
        <button
          type="button"
          onClick={() => onSelectService('market')}
          className="relative flex flex-col justify-between p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left group overflow-hidden h-36"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Grand Marché
            </span>
          </div>

          <div className="relative my-auto flex items-center justify-end pr-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">Magasins</h3>
            <p className="text-[11px] font-medium text-slate-500">Commerces locaux</p>
          </div>
        </button>

        {/* Service 4 : Food / Restauration */}
        <button
          type="button"
          onClick={() => onSelectService('food')}
          className="relative flex flex-col justify-between p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left group overflow-hidden h-36"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
              Saveurs
            </span>
          </div>

          <div className="relative my-auto flex items-center justify-end pr-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Utensils className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">Food</h3>
            <p className="text-[11px] font-medium text-slate-500">Makis & Restos</p>
          </div>
        </button>
      </div>

      {/* 2. Rameau horizontal de services secondaires (Style Yango) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => onSelectService('interurban')}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shrink-0 transition-colors"
        >
          <Bus className="w-4 h-4 text-slate-600" />
          <span>Interurbain</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectService('rides')}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shrink-0 transition-colors"
        >
          <Bike className="w-4 h-4 text-slate-600" />
          <span>Motos Express</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectService('rides')}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shrink-0 transition-colors"
        >
          <Car className="w-4 h-4 text-slate-600" />
          <span>Taxis Communaux</span>
        </button>
      </div>
    </div>
  );
}
