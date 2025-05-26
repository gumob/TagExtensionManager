import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionProvider } from '@/contexts/ExtensionContext';
import { ExtensionMain } from '@/features/popup/components/main/ExtensionMain';
import '@/styles/globals.css';
import { logger } from '@/utils/Logger';

/**
 * The main component for the extension manager.
 * @returns
 */
const Popup: React.FC = () => {
  /**
   * Setup color scheme listener.
   */
  useEffect(() => {
    logger.debug('🍭🌱 Initializing popup document', {
      group: 'Popup',
      persist: true,
    });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      logger.debug('🍭🫱 Color scheme changed', {
        group: 'Popup',
        persist: true,
      });
      chromeAPI.sendRuntimeMessage({
        type: 'COLOR_SCHEME_CHANGED',
        isDarkMode: e.matches,
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      logger.debug('🍭🗑️ Deinitializing popup document', {
        group: 'Popup',
        persist: true,
      });
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  /**
   * Render the component.
   * @returns
   */
  return (
    <>
      <ExtensionMain />
      <Toaster
        position="top-center"
        containerClassName="!top-5"
        toastOptions={{
          className:
            '!text-zinc-900 dark:!text-zinc-100 !bg-zinc-50 dark:!bg-zinc-700 !rounded-xl !shadow-lg shadow-zinc-300 dark:shadow-zinc-900',
        }}
      />
    </>
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
      <ExtensionProvider>
        <Popup />
      </ExtensionProvider>
    </React.StrictMode>
  );
}
