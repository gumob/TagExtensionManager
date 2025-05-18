import React, { useEffect, useState } from 'react';
import { ExtensionCard } from '@/components/ExtensionCard';
import { Extension } from '@/types/extension';
import { toggleExtension } from '@/utils/extensionUtils';

interface ExtensionListProps {
  extensions: Extension[];
  onExtensionStateChange: (id: string, enabled: boolean) => void;
}

export function ExtensionList({ extensions, onExtensionStateChange }: ExtensionListProps) {
  const [localExtensions, setLocalExtensions] = useState<Extension[]>(extensions);

  useEffect(() => {
    setLocalExtensions(extensions);
  }, [extensions]);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await toggleExtension(id, enabled);
      onExtensionStateChange(id, enabled);
    } catch (error) {
      console.error('Failed to toggle extension:', error);
    }
  };

  const handleSettingsClick = (extensionId: string) => {
    const browser = navigator.userAgent.toLowerCase();
    let baseUrl = 'chrome://extensions';
    
    if (browser.includes('brave')) {
      baseUrl = 'brave://extensions';
    } else if (browser.includes('edg')) {
      baseUrl = 'edge://extensions';
    } else if (browser.includes('opera')) {
      baseUrl = 'opera://extensions';
    } else if (browser.includes('vivaldi')) {
      baseUrl = 'vivaldi://extensions';
    }

    chrome.tabs.create({ url: `${baseUrl}/?id=${extensionId}` });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localExtensions.map((extension) => (
        <ExtensionCard 
          key={extension.id} 
          extension={extension} 
          onToggle={handleToggle}
          onSettingsClick={handleSettingsClick}
        />
      ))}
    </div>
  );
} 