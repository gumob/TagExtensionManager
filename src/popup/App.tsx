import { ExtensionManager } from '@/components/ExtensionManager';
import { useProfileStore } from '@/stores/profileStore';
import { setupColorSchemeListener } from '@/utils/themeUtils';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const { addProfile, importProfiles, profiles } = useProfileStore();

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

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'CREATE_DEFAULT_PROFILE') {
        console.debug('[Extension Manager][App] Creating Default profile');
        addProfile('Default', message.extensions);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [addProfile]);

  // 初回マウント時にchrome.storage.localからDefaultプロファイルを反映
  useEffect(() => {
    chrome.storage.local.get('extension-manager-profiles', result => {
      const stored = result['extension-manager-profiles'];
      if (stored && Array.isArray(stored.profiles) && profiles.length === 0) {
        importProfiles(stored.profiles);
      }
    });
  }, []);

  return (
    <>
      <ExtensionManager />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
