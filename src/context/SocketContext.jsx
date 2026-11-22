/**
 * Contexte global de connexion WebSocket (Socket.io) pour INSTAR.
 * Authentification sur le handshake, reconnexion automatique après coupure réseau.
 */

import { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connexion Socket.io uniquement si l'utilisateur est authentifié
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('🔌 [WebSocket] Connexion temps réel établie.');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.warn('🔌 [WebSocket] Déconnexion :', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ [WebSocket] Erreur de connexion :', err.message);
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token, isAuthenticated]);

  // Enregistrement d'un écouteur d'événement avec nettoyage automatique
  const on = useCallback((eventName, handler) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(eventName, handler);
    return () => socket.off(eventName, handler);
  }, []);

  // Émission d'un événement vers le serveur
  const emit = useCallback((eventName, data) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(eventName, data);
    }
  }, []);

  const contextValue = useMemo(() => ({
    socket: socketRef.current,
    isConnected,
    on,
    emit,
  }), [isConnected, on, emit]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket doit être utilisé à l\'intérieur d\'un SocketProvider.');
  }
  return context;
}

export default SocketContext;
