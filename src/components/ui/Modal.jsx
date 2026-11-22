/**
 * Composant Boîte Modale (Modal) réutilisable de l'interface INSTAR.
 * Gère l'affichage en superposition, la fermeture sur touche Échap et le clic extérieur.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = '',
  showCloseButton = true,
}) {
  // Fermeture lors de la pression sur la touche Échap
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Arrière-plan assombri avec flou */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteneur de la boîte modale */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-md bg-instar-surface rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-instar-border max-h-[90vh] overflow-y-auto text-left ${className}`}
      >
        {/* En-tête de la modale */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between pb-4 mb-4 border-b border-instar-border">
            <div>
              {title && <h2 className="text-lg font-bold text-instar-text">{title}</h2>}
              {subtitle && <p className="text-xs text-instar-text-muted mt-1">{subtitle}</p>}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la boîte de dialogue"
                className="p-1.5 rounded-full text-instar-text-muted hover:text-instar-text hover:bg-instar-surface-alt transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Corps de contenu */}
        <div>{children}</div>
      </div>
    </div>
  );
}
