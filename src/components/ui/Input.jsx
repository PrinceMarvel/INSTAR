/**
 * Composant Champ de saisie (Input) réutilisable de l'interface INSTAR.
 * Intègre la gestion des libellés, icônes, états d'erreur et accessibilité.
 */

import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    type = 'text',
    className = '',
    id,
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-instar-text tracking-wide flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-instar-danger ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-instar-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`w-full bg-instar-surface text-instar-text placeholder:text-instar-text-muted text-sm rounded-xl border transition-colors duration-150 py-3 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-instar-danger focus:border-instar-danger focus:ring-1 focus:ring-instar-danger'
              : 'border-instar-border focus:border-instar-border-active focus:ring-1 focus:ring-instar-secondary'
          } disabled:bg-instar-surface-alt disabled:opacity-60 disabled:cursor-not-allowed outline-none ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-instar-danger font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-instar-text-muted mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
