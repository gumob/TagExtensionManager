import '@/styles/globals.css';

import React, {
  useEffect,
  useRef,
} from 'react';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { ExtensionProvider } from '@/contexts';
import { ExtensionMain } from '@/features/popup/components/main';
import {
  detectTheme,
  logger,
} from '@/utils';

/**
 * The main component for the options page.
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

      logger.debug('📄⌥', '[Options.tsx]', '[useEffect]', 'Initializing options document');
      await detectTheme();
    };

    initialize();

    return () => {
      isInitialized.current = false;
      logger.debug('📄⌥', '[Options.tsx]', '[useEffect]', 'Deinitializing options document');
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

// Create root and render
const root = createRoot(document.getElementById('root')!);
root.render(<Options />);
