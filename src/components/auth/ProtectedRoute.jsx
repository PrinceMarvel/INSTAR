/**
 * Composant Gardien de Navigation (ProtectedRoute) pour INSTAR.
 * Protège les routes selon l'état d'authentification et les privilèges d'accès (RBAC).
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  fallback = null,
  onRedirectToLogin,
}) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-instar-bg">
        <div className="w-12 h-12 rounded-2xl bg-instar-secondary flex items-center justify-center shadow-instar-action mb-4 animate-pulse">
          <span className="font-black text-lg text-instar-text">IN</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-instar-text-muted">
          <Loader2 className="w-4 h-4 animate-spin text-instar-secondary" />
          <span>Chargement sécurisé...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (onRedirectToLogin) {
      onRedirectToLogin();
      return null;
    }
    return fallback;
  }

  // Vérification des privilèges par rôle
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="instar-screen justify-center text-center py-10">
        <div className="w-16 h-16 rounded-full bg-red-100 text-instar-danger mx-auto flex items-center justify-center text-2xl font-bold mb-4">
          !
        </div>
        <h2 className="text-lg font-bold text-instar-text">Accès restreint</h2>
        <p className="text-xs text-instar-text-muted mt-2 max-w-xs mx-auto">
          Vous ne disposez pas des privilèges nécessaires pour afficher cet espace de travail.
        </p>
      </div>
    );
  }

  return children;
}
