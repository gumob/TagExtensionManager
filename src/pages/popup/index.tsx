import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { ExtensionProvider } from '@/contexts';
import { ExtensionMain } from '@/features/popup/components/main';
import '@/styles/globals.css';
import { detectTheme, logger } from '@/utils';

/**
 * The main component for the extension manager.
 * @returns
 */
const Popup: React.FC = () => {
  /**
   * Setup color scheme listener.
   */
  useEffect(() => {
    logger.debug('🍭🍭🍭🌱 Initializing popup document', {
      group: 'Popup',
      persist: true,
    });
    detectTheme();
    return () => {
      logger.debug('🍭🍭🍭🗑️ Deinitializing popup document', {
        group: 'Popup',
        persist: true,
      });
    };
  }, []);

  /**
   * Render the component.
   * @returns
   */
  return (
    <ExtensionProvider>
      <ExtensionMain />
      <Toaster
        position="top-center"
        containerClassName="!top-5"
        toastOptions={{
          className: 'toast-container',
        }}
      />
    </ExtensionProvider>
  );
};

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
      <Popup />
    </React.StrictMode>
  );
}
