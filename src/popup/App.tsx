import { ExtensionManager } from '@/components/ExtensionManager';
import { setupColorSchemeListener } from '@/utils/themeUtils';
import React, { useEffect } from 'react';

const App: React.FC = () => {
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

  return <ExtensionManager />;
};

export default App;
