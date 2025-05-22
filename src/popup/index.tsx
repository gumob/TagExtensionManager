import App from '@/popup/App';
import '@/styles/globals.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * The container element.
 */
const container = document.getElementById('app');

/**
 * The root element.
 */
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
