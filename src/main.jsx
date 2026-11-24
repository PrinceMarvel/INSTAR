/**
 * Point de montage principal React 18 pour l'application INSTAR.
 * Charge les styles Tailwind centralisés et monte le composant racine.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
