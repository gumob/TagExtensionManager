/// <reference path="../types/chrome.d.ts" />
import React, { useEffect, useState } from 'react';
import { ExtensionCard } from '@/components/ExtensionCard';
import { Extension } from '@/types/extension';
import { getAllExtensions, toggleExtension } from '@/utils/extensionUtils';

interface ExtensionListProps {
  extensions: Extension[];
}

export function ExtensionList({ extensions }: ExtensionListProps) {
  const [localExtensions, setLocalExtensions] = useState<Extension[]>(extensions);

  useEffect(() => {
    getAllExtensions().then(setLocalExtensions);
  }, []);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await toggleExtension(id, enabled);
      setLocalExtensions((prev) =>
        prev.map((ext) =>
          ext.id === id ? { ...ext, enabled } : ext
        )
      );
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