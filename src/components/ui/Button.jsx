/**
 * Composant Bouton réutilisable de l'interface INSTAR.
 * Utilise strictement les styles de la charte officielle sans couleur codée en dur.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-instar-secondary text-instar-text hover:bg-instar-secondary-hover shadow-instar-action active:scale-[0.98]',
  secondary: 'bg-instar-surface text-instar-text border border-instar-border hover:bg-instar-surface-alt active:scale-[0.98]',
  danger: 'bg-instar-danger text-instar-primary hover:opacity-90 active:scale-[0.98]',
  ghost: 'bg-transparent text-instar-text hover:bg-instar-surface-alt active:scale-[0.98]',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl',
  lg: 'px-5 py-3.5 text-base font-bold rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none select-none ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Chargement...</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
}
