/**
 * Fonctions utilitaires de formatage pour l'interface INSTAR.
 * Conformes aux règles de Precision.MD : typographie française impeccable.
 */

/**
 * Formate un montant en Francs CFA (XOF) avec séparateur de milliers.
 * @param {number} amount - Montant à afficher.
 * @returns {string} Montant formaté (ex: "1 500 FCFA").
 */
export function formatCFA(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0 FCFA';
  }

  const formattedAmount = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return `${formattedAmount} FCFA`;
}

/**
 * Formate une distance de manière lisible selon l'échelle.
 * @param {number} distanceKm - Distance en kilomètres.
 * @returns {string} Distance affichée (ex: "800 m" ou "2,5 km").
 */
export function formatDistance(distanceKm) {
  if (typeof distanceKm !== 'number' || isNaN(distanceKm)) {
    return '—';
  }

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1).replace('.', ',')} km`;
}

/**
 * Formate une durée estimée de trajet en minutes.
 * @param {number} minutes - Durée en minutes.
 * @returns {string} Durée affichée (ex: "5 min" ou "1 h 20 min").
 */
export function formatDuration(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes)) {
    return '—';
  }

  if (minutes < 60) {
    return `${Math.ceil(minutes)} min`;
  }

  const heures = Math.floor(minutes / 60);
  const restant = Math.ceil(minutes % 60);
  return restant > 0 ? `${heures} h ${restant} min` : `${heures} h`;
}

/**
 * Formate une date ISO au format français complet.
 * @param {string|Date} dateInput - Date à formater.
 * @returns {string} Date au format "21 novembre 2026 à 14h30".
 */
export function formatDateFr(dateInput) {
  if (!dateInput) return '—';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(':', 'h');
}

/**
 * Formate une date ISO en format court français.
 * @param {string|Date} dateInput - Date à formater.
 * @returns {string} Date au format "21/11/2026".
 */
export function formatDateShortFr(dateInput) {
  if (!dateInput) return '—';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Affiche l'heure seule au format français.
 * @param {string|Date} dateInput - Date à formater.
 * @returns {string} Heure au format "14h30".
 */
export function formatTimeFr(dateInput) {
  if (!dateInput) return '—';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}h${minutes}`;
}
