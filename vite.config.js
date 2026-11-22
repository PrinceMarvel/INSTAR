import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuration Vite pour l'application INSTAR (PWA & Web Mobile).
 * Optimisé pour le rechargement à chaud (HMR) et l'expérience mobile responsive.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Permet le test direct depuis un smartphone sur le même réseau local
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
});
