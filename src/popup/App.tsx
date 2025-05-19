import { ExtensionManager } from '@/components/ExtensionManager';
import { setupColorSchemeListener } from '@/utils/themeUtils';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * The main component for the extension manager.
 * @returns
 */
const App: React.FC = () => {
  /**
   * Setup color scheme listener.
   */
  useEffect(() => {
    return setupColorSchemeListener(isDarkMode => {
      console.debug(
        '[Extension Manager][App] Color scheme changed:',
        isDarkMode ? 'dark' : 'light'
      );
      chrome.runtime.sendMessage({
        type: 'COLOR_SCHEME_CHANGED',
        isDarkMode,
      });
    });
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
