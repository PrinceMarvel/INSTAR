/**
 * Client HTTP Axios centralisé pour l'API INSTAR.
 * Intercepteurs de requête (injection JWT) et de réponse (gestion expiration de session).
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête : injection automatique du jeton Bearer JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('instar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : gestion centralisée des erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Session expirée ou jeton invalide : nettoyage et redirection propre
      if (status === 401) {
        localStorage.removeItem('instar_token');
        localStorage.removeItem('instar_user');
        localStorage.removeItem('instar_role');

        // Éviter la boucle de redirection si déjà sur la page de connexion
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
