import App from '@/popup/App';
import '@/styles/globals.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
