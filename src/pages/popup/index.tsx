import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionManager } from '@/features/extension/components/ExtensionManager';
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
      <ExtensionManager />
      <Toaster
        position="top-center"
        containerClassName="!top-5"
        toastOptions={{
          className:
            '!bg-zinc-300 !text-zinc-900 dark:!bg-zinc-700 dark:!text-zinc-100 !rounded-xl !shadow-lg',
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
      <Popup />
    </React.StrictMode>
  );
}
