import React, { useEffect, useRef } from 'react';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { ExtensionProvider } from '@/contexts';
import { ExtensionMain } from '@/features/options/components/main';
import '@/styles/globals.css';
import { detectTheme, logger } from '@/utils';

/**
 * The main component for the extension manager.
 * @returns
 */
const Options: React.FC = () => {
  const isInitialized = useRef(false);
  /**
   * Setup color scheme listener.
   */
  useEffect(() => {
    const initialize = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      logger.debug('Initializing options document');
      await detectTheme();
    };

    initialize();

    return () => {
      isInitialized.current = false;
      logger.debug('Deinitializing options document');
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
          className: '!text-zinc-900 dark:!text-zinc-100 !bg-zinc-50 dark:!bg-zinc-700 !rounded-xl !shadow-lg shadow-zinc-300 dark:shadow-zinc-900',
        }}
      />
    </ExtensionProvider>
  );
};

/**
 * The container element.
 */
const container = document.getElementById('root');

/**
 * The root element.
 */
if (container) {
  const root = createRoot(container);
  root.render(
    // <React.StrictMode>
    <Options />
    // </React.StrictMode>
  );
}
