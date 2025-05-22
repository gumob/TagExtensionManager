import React, { useEffect } from 'react';

import { Toaster } from 'react-hot-toast';

import { ExtensionManager } from '@/features/extension/components/ExtensionManager';
import { logger } from '@/shared/utils/Logger';
import { setupColorSchemeListener } from '@/shared/utils/ThemeUtils';

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
      chrome.runtime.sendMessage({
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

export default App;
