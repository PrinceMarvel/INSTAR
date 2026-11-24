/**
 * Contexte global d'authentification pour l'application INSTAR.
 * Gère les sessions utilisateur (Passager, Chauffeur, Admin) avec persistance locale sécurisée.
 */

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import apiClient from '../config/api';

const AuthContext = createContext(null);

const STORAGE_KEYS = Object.freeze({
  TOKEN: 'instar_token',
  USER: 'instar_user',
  ROLE: 'instar_role',
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restauration de la session persistée au chargement initial
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
    } catch (err) {
      // Nettoyage en cas de données corrompues dans le stockage local
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarde centralisée de la session dans le stockage local et l'état React
  const saveSession = useCallback((sessionData) => {
    const { token: newToken, account, user: userData, admin, driver: driverData, role: newRole } = sessionData;
    const profileData = account || userData || admin || driverData;
    const determinedRole = newRole || profileData?.role || 'PASSENGER';

    setToken(newToken);
    setUser(profileData);
    setRole(determinedRole);

    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profileData));
    localStorage.setItem(STORAGE_KEYS.ROLE, determinedRole);
  }, []);

  // Inscription d'un passager
  const registerPassenger = useCallback(async (formData) => {
    const response = await apiClient.post('/auth/register/passenger', formData);
    saveSession(response.data.data);
    return response.data;
  }, [saveSession]);

  // Inscription d'un chauffeur
  const registerDriver = useCallback(async (formData) => {
    const response = await apiClient.post('/auth/register/driver', formData);
    saveSession(response.data.data);
    return response.data;
  }, [saveSession]);

  // Connexion mobile (Passager ou Chauffeur)
  const loginMobile = useCallback(async (phoneNumber, password, userType) => {
    const response = await apiClient.post('/auth/login', { phoneNumber, password, userType });
    saveSession(response.data.data);
    return response.data;
  }, [saveSession]);

  // Connexion administrateur
  const loginAdmin = useCallback(async (email, password) => {
    const response = await apiClient.post('/auth/admin/login', { email, password });
    saveSession(response.data.data);
    return response.data;
  }, [saveSession]);

  // Déconnexion propre
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    token,
    role,
    isAuthenticated: Boolean(token),
    isLoading,
    registerPassenger,
    registerDriver,
    loginMobile,
    loginAdmin,
    logout,
  }), [user, token, role, isLoading, registerPassenger, registerDriver, loginMobile, loginAdmin, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider.');
  }
  return context;
}

export default AuthContext;
