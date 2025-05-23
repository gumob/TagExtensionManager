import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { chromeAPI } from '@/api/chrome';
import { ExtensionManager } from '@/features/extension/components/ExtensionManager';
import '@/styles/globals.css';
import { logger } from '@/utils/Logger';

/**
 * The main component for the extension manager.
 * @returns
 */
const App: React.FC = () => {
  /**
   * Setup color scheme listener.
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      logger.debug('Color scheme changed', {
        group: 'App',
        persist: true,
      });
      chromeAPI.sendRuntimeMessage({
        type: 'COLOR_SCHEME_CHANGED',
        isDarkMode: e.matches,
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
      <App />
    </React.StrictMode>
  );
}
