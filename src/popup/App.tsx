import React, { useEffect } from 'react';
import { ExtensionManager } from '@/components/ExtensionManager';
import { setupColorSchemeListener } from '@/utils/themeUtils';

const App: React.FC = () => {
  useEffect(() => {
    return setupColorSchemeListener((isDarkMode) => {
      console.debug('[Extension Manager][App] Color scheme changed:', isDarkMode ? 'dark' : 'light');
      chrome.runtime.sendMessage({
        type: 'COLOR_SCHEME_CHANGED',
        isDarkMode
      });
    });
  }, []);

  return <ExtensionManager />;
};

export default App; 