/**
 * Composant Badge de statut réutilisable de l'interface INSTAR.
 * Affiche l'état d'une course, d'un compte ou d'un paiement selon la charte.
 */

import React from 'react';

const VARIANTS = {
  success: 'bg-emerald-50 text-instar-success border-emerald-200',
  warning: 'bg-amber-50 text-instar-warning border-amber-200',
  danger: 'bg-red-50 text-instar-danger border-red-200',
  info: 'bg-blue-50 text-instar-info border-blue-200',
  neutral: 'bg-instar-surface-alt text-instar-text-muted border-instar-border',
  accent: 'bg-yellow-100 text-yellow-900 border-instar-secondary',
};

const DOT_COLORS = {
  success: 'bg-instar-success',
  warning: 'bg-instar-warning',
  danger: 'bg-instar-danger',
  info: 'bg-instar-info',
  neutral: 'bg-instar-text-muted',
  accent: 'bg-instar-secondary',
};

export default function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.neutral;
  const dotColor = DOT_COLORS[variant] || DOT_COLORS.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${variantClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{children}</span>
    </span>
  );
}
