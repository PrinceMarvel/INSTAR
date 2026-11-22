/**
 * Composant de saisie de numéro de téléphone international pour INSTAR.
 * Permet la sélection de l'indicatif avec affichage du drapeau national (défaut : Côte d'Ivoire).
 */

import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export const COUNTRY_CODES = [
  { code: 'CI', name: 'Côte d’Ivoire', dialCode: '+225', flag: '🇨🇮', placeholder: '07 08 09 10 11' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', placeholder: '70 12 34 56' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', placeholder: '65 12 34 56' },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳', placeholder: '620 12 34 56' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', placeholder: '77 123 45 67' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', placeholder: '24 123 4567' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', placeholder: '90 12 34 56' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯', placeholder: '97 12 34 56' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', placeholder: '90 12 34 56' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', placeholder: '802 123 4567' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', placeholder: '6 70 12 34 56' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', placeholder: '6 12 34 56 78' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪', placeholder: '470 12 34 56' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭', placeholder: '78 123 45 67' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸', placeholder: '(202) 555-0143' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', placeholder: '(416) 555-0143' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧', placeholder: '7911 123456' },
];

export default function PhoneInput({
  label = 'Numéro de téléphone',
  value = '',
  onChange,
  error,
  helperText,
  disabled = false,
  required = true,
  className = '',
}) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Défaut Côte d'Ivoire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extraction du numéro local (sans l'indicatif) pour l'affichage dans le champ texte
  const localNumber = useMemo(() => {
    if (!value) return '';
    if (value.startsWith(selectedCountry.dialCode)) {
      return value.slice(selectedCountry.dialCode.length);
    }
    return value.replace(/^\+?[0-9]{1,4}/, '');
  }, [value, selectedCountry.dialCode]);

  const handleNumberChange = (e) => {
    // Conservation uniquement des chiffres saisis
    const rawDigits = e.target.value.replace(/[^0-9]/g, '');
    const fullNumber = rawDigits ? `${selectedCountry.dialCode}${rawDigits}` : '';
    if (onChange) {
      onChange(fullNumber);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(false);
    setSearchQuery('');
    if (localNumber && onChange) {
      onChange(`${country.dialCode}${localNumber}`);
    }
  };

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRY_CODES;
    const query = searchQuery.toLowerCase().trim();
    return COUNTRY_CODES.filter(
      (c) => c.name.toLowerCase().includes(query) || c.dialCode.includes(query)
    );
  }, [searchQuery]);

  return (
    <div className={`w-full flex flex-col gap-1.5 text-left ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-instar-text tracking-wide flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-instar-danger ml-1">*</span>}
          </span>
          <span className="text-[11px] font-normal text-instar-text-muted">International</span>
        </label>
      )}

      <div className="relative flex items-center">
        {/* Bouton de sélection du drapeau et indicatif */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsModalOpen(true)}
          className="h-[46px] px-3 bg-instar-surface-alt hover:bg-instar-border/60 border border-r-0 border-instar-border rounded-l-xl flex items-center gap-1.5 transition-colors select-none text-sm text-instar-text font-medium"
        >
          <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <span>{selectedCountry.dialCode}</span>
          <ChevronDown className="w-3.5 h-3.5 text-instar-text-muted" />
        </button>

        {/* Champ de saisie du numéro */}
        <input
          type="tel"
          disabled={disabled}
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={selectedCountry.placeholder}
          className={`w-full h-[46px] bg-instar-surface text-instar-text placeholder:text-instar-text-muted text-sm rounded-r-xl border transition-colors px-3 outline-none ${
            error
              ? 'border-instar-danger focus:border-instar-danger'
              : 'border-instar-border focus:border-instar-border-active'
          } disabled:bg-instar-surface-alt disabled:cursor-not-allowed`}
        />
      </div>

      {error ? (
        <p className="text-xs text-instar-danger font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-instar-text-muted mt-0.5">{helperText}</p>
      ) : null}

      {/* Boîte modale de choix du pays */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-sm bg-instar-surface rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-instar-border max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-instar-border mb-3">
              <h3 className="font-bold text-instar-text text-base">Sélectionnez votre pays</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-instar-text-muted hover:text-instar-text hover:bg-instar-surface-alt"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Champ de recherche */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-instar-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un pays ou un indicatif..."
                className="w-full bg-instar-surface-alt text-instar-text text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none border border-instar-border focus:border-instar-border-active"
                autoFocus
              />
            </div>

            {/* Liste des pays */}
            <div className="overflow-y-auto space-y-1 pr-1 flex-1">
              {filteredCountries.map((country) => (
                <button
                  key={`${country.code}-${country.dialCode}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                    selectedCountry.code === country.code
                      ? 'bg-instar-secondary/20 font-bold text-instar-text'
                      : 'hover:bg-instar-surface-alt text-instar-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <span className="font-semibold text-instar-text-muted">{country.dialCode}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <p className="text-xs text-center text-instar-text-muted py-6">Aucun pays trouvé.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
