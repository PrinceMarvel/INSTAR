/**
 * Charte colorimétrique officielle et centralisée du projet INSTAR (Gagnoa Transport).
 * RÈGLE D'OR : Aucune couleur hexadécimale ne doit être codée en dur dans les composants.
 * Toutes les teintes sont importées ou utilisées via les classes Tailwind associées.
 */

export const COLORS = Object.freeze({
  // Couleurs fondamentales officielles de la charte
  primary: '#FFFFFF',          // Blanc : Fond épuré, clarté, transparence et confiance
  secondary: '#FACC15',        // Jaune vif (Accent) : Énergie, alertes et boutons d'action (CTA)
  secondaryHover: '#EAB308',   // Jaune soutenu pour l'état survol / pression

  // Arrière-plans et cartes
  background: '#F8FAFC',       // Blanc légèrement cassé pour confort visuel mobile
  surface: '#FFFFFF',          // Blanc pur pour les cartes, modales et fiches
  surfaceAlt: '#F1F5F9',       // Fond pour les champs de saisie et séparateurs

  // Typographie et contrastes de lecture
  textPrimary: '#0F172A',      // Noir bleuté profond pour lisibilité optimale
  textSecondary: '#64748B',    // Gris neutre pour libellés secondaires et repères
  textMuted: '#94A3B8',        // Gris clair pour textes d'aide et placeholders

  // Statuts et alertes fonctionnelles
  success: '#10B981',          // Vert émeraude : course validée, chauffeur en ligne
  warning: '#F59E0B',          // Ambre : en attente de chauffeur
  danger: '#EF4444',           // Rouge : annulation, erreur, avertissement dette
  info: '#3B82F6',             // Bleu : notification, information de parcours

  // Bordures
  border: '#E2E8F0',           // Gris très doux pour délimiter les cartes
  borderActive: '#FACC15',     // Bordure jaune pour les éléments sélectionnés
});

export default COLORS;
