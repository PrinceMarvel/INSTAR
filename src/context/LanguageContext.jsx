/**
 * Contexte global d'internationalisation (i18n) pour INSTAR.
 * Adapte automatiquement la langue de l'interface en fonction du pays sélectionné.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TRANSLATIONS, COUNTRY_LANGUAGE_MAP } from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'instar_language';

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'fr';
  });

  // Synchronisation de l'attribut lang du document HTML
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    localStorage.setItem(STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  /**
   * Bascule automatiquement la langue selon le pays choisi via son indicatif.
   * @param {string} countryCode - Code ISO du pays (ex: 'CI', 'GH', 'FR', 'NG').
   */
  const setLanguageByCountry = useCallback((countryCode) => {
    if (!countryCode) return;
    const targetLang = COUNTRY_LANGUAGE_MAP[countryCode.toUpperCase()] || 'fr';
    setCurrentLanguage(targetLang);
  }, []);

  /**
   * Fonction de traduction de clé.
   * @param {string} key - Clé de traduction.
   * @returns {string} Libellé traduit.
   */
  const t = useCallback(
    (key) => {
      const dictionary = TRANSLATIONS[currentLanguage] || TRANSLATIONS.fr;
      return dictionary[key] || TRANSLATIONS.fr[key] || key;
    },
    [currentLanguage]
  );

  const contextValue = useMemo(
    () => ({
      currentLanguage,
      setCurrentLanguage,
      setLanguageByCountry,
      t,
      isEnglish: currentLanguage === 'en',
    }),
    [currentLanguage, setLanguageByCountry, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage doit être utilisé à l’intérieur d’un LanguageProvider.');
  }
  return context;
}

export default LanguageContext;
