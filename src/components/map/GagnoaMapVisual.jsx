/**
 * Visualiseur de carte vectorielle de Gagnoa façon Yango / Uber.
 * Représente la topographie urbaine, les quartiers clés, les véhicules en circulation et l'itinéraire.
 */

import React, { useState } from 'react';
import { Plus, Minus, Navigation as NavIcon, QrCode } from 'lucide-react';

// Coordonnées relatives sur la grille SVG (1000 x 800) des repères clés de Gagnoa
const LANDMARK_MAP_COORDS = {
  garahio: { x: 380, y: 320, name: 'Garahio' },
  dokui: { x: 620, y: 260, name: 'Dokui' },
  grand_marche: { x: 480, y: 440, name: 'Grand Marché' },
  dioulabougou: { x: 420, y: 560, name: 'Dioulabougou' },
  babre: { x: 300, y: 620, name: 'Babré' },
  soleil: { x: 240, y: 380, name: 'Soleil' },
};

// Chauffeurs fictifs en patrouille dans Gagnoa (motos & taxis)
const MOCK_DRIVERS = [
  { id: 'd1', type: 'moto', x: 410, y: 350, rotation: 35 },
  { id: 'd2', type: 'moto', x: 550, y: 310, rotation: -60 },
  { id: 'd3', type: 'taxi', x: 470, y: 480, rotation: 110 },
  { id: 'd4', type: 'taxi', x: 680, y: 280, rotation: 15 },
  { id: 'd5', type: 'moto', x: 330, y: 590, rotation: -25 },
];

export default function GagnoaMapVisual({ pickup, destination }) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const pickupCoord = pickup?.landmarkId ? LANDMARK_MAP_COORDS[pickup.landmarkId] : null;
  const destCoord = destination?.landmarkId ? LANDMARK_MAP_COORDS[destination.landmarkId] : null;

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#F3F4F6] overflow-hidden select-none">
      {/* Canevas SVG de la carte stylisée de Gagnoa */}
      <svg
        viewBox="0 0 1000 800"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          <pattern id="roadGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#E5E7EB" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Fond avec quadrillage urbain doux */}
        <rect width="1000" height="800" fill="#F8FAFC" />
        <rect width="1000" height="800" fill="url(#roadGrid)" />

        {/* Espaces verts & zones naturelles de Gagnoa */}
        <path d="M 50 120 Q 180 80 260 190 T 120 320 Z" fill="#DCFCE7" opacity="0.6" />
        <path d="M 720 450 Q 880 400 920 600 T 750 720 Z" fill="#DCFCE7" opacity="0.5" />

        {/* Réseau d'artères principales de Gagnoa */}
        <g stroke="#CBD5E1" strokeLinecap="round" strokeLinejoin="round">
          {/* Axe principal Nord-Sud : Garahio - Grand Marché - Babré */}
          <path d="M 400 60 L 380 320 L 480 440 L 420 560 L 300 620 L 260 760" strokeWidth="20" stroke="#FFFFFF" />
          <path d="M 400 60 L 380 320 L 480 440 L 420 560 L 300 620 L 260 760" strokeWidth="14" stroke="#E2E8F0" />

          {/* Axe Est-Ouest : Dokui - Grand Marché - Soleil */}
          <path d="M 850 200 L 620 260 L 480 440 L 240 380 L 80 400" strokeWidth="18" stroke="#FFFFFF" />
          <path d="M 850 200 L 620 260 L 480 440 L 240 380 L 80 400" strokeWidth="12" stroke="#E2E8F0" />

          {/* Voies secondaires inter-quartiers */}
          <path d="M 380 320 L 620 260" strokeWidth="10" stroke="#FFFFFF" />
          <path d="M 380 320 L 620 260" strokeWidth="6" stroke="#E2E8F0" />

          <path d="M 240 380 L 300 620" strokeWidth="10" stroke="#FFFFFF" />
          <path d="M 240 380 L 300 620" strokeWidth="6" stroke="#E2E8F0" />

          <path d="M 480 440 L 720 520 L 780 660" strokeWidth="10" stroke="#FFFFFF" />
          <path d="M 480 440 L 720 520 L 780 660" strokeWidth="6" stroke="#E2E8F0" />
        </g>

        {/* Noms discrets des quartiers de Gagnoa */}
        {Object.entries(LANDMARK_MAP_COORDS).map(([key, point]) => (
          <g key={key} transform={`translate(${point.x}, ${point.y})`}>
            <circle r="4" fill="#94A3B8" />
            <text
              y="18"
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-500 tracking-wide select-none pointer-events-none"
            >
              {point.name}
            </text>
          </g>
        ))}

        {/* Trajet sélectionné avec ligne d'itinéraire animée */}
        {pickupCoord && destCoord && (
          <g>
            <line
              x1={pickupCoord.x}
              y1={pickupCoord.y}
              x2={destCoord.x}
              y2={destCoord.y}
              stroke="#FACC15"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="8 8"
            />
          </g>
        )}

        {/* Chauffeurs en mouvement sur la carte */}
        {MOCK_DRIVERS.map((driver) => (
          <g
            key={driver.id}
            transform={`translate(${driver.x}, ${driver.y}) rotate(${driver.rotation})`}
            className="transition-all duration-700"
          >
            {driver.type === 'taxi' ? (
              // Icône Taxi (vue de dessus style Yango)
              <g>
                <rect x="-9" y="-16" width="18" height="32" rx="4" fill="#0F172A" />
                <rect x="-7" y="-6" width="14" height="14" rx="2" fill="#FACC15" />
                <circle cx="-5" cy="-14" r="1.5" fill="#EF4444" />
                <circle cx="5" cy="-14" r="1.5" fill="#EF4444" />
              </g>
            ) : (
              // Icône Moto-taxi (vue de dessus)
              <g>
                <rect x="-3" y="-12" width="6" height="24" rx="3" fill="#0F172A" />
                <line x1="-8" y1="-5" x2="8" y2="-5" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="-2" r="3" fill="#FACC15" />
              </g>
            )}
          </g>
        ))}

        {/* Balise de départ (Puce rouge style Yango) */}
        {pickupCoord && (
          <g transform={`translate(${pickupCoord.x}, ${pickupCoord.y})`}>
            <circle r="16" fill="#EF4444" opacity="0.25" className="animate-ping" />
            <circle r="10" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
            <circle r="4" fill="#FFFFFF" />
          </g>
        )}

        {/* Balise de destination (Puce noire style Yango) */}
        {destCoord && (
          <g transform={`translate(${destCoord.x}, ${destCoord.y})`}>
            <circle r="16" fill="#0F172A" opacity="0.25" />
            <circle r="10" fill="#0F172A" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="-3" y="-3" width="6" height="6" fill="#FFFFFF" rx="1" />
          </g>
        )}
      </svg>

      {/* Commandes de zoom et recentrage en haut à droite (Style Yango) */}
      <div className="absolute right-6 top-6 flex flex-col gap-2 z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            aria-label="Zoom avant"
            className="p-3 text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            aria-label="Zoom arrière"
            className="p-3 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setZoomLevel(1)}
          aria-label="Recentrer la carte"
          className="p-3 bg-white rounded-2xl shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
        >
          <NavIcon className="w-5 h-5 text-instar-text" />
        </button>
      </div>

      {/* Widget QR Code Application en bas à droite (identique à l'écran Yango) */}
      <div className="hidden lg:flex absolute right-6 bottom-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 items-center gap-3 max-w-xs z-10">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
          <QrCode className="w-7 h-7 text-slate-800" />
        </div>
        <p className="text-[11px] font-medium text-slate-600 leading-tight">
          Installez <strong className="text-slate-900 font-bold">INSTAR</strong> sur votre téléphone pour commander plus vite.
        </p>
      </div>
    </div>
  );
}
