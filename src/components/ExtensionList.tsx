/// <reference path="../types/chrome.d.ts" />
import React, { useEffect, useState } from 'react';
import { ExtensionCard } from '@/components/ExtensionCard';

interface Extension {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  iconUrl: string;
}

interface ExtensionListProps {
  extensions: Extension[];
}

export function ExtensionList({ extensions }: ExtensionListProps) {
  const [localExtensions, setLocalExtensions] = useState<Extension[]>(extensions);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.management) {
      chrome.management.getAll((extensions) => {
        const formattedExtensions = extensions.map((ext) => ({
          id: ext.id,
          name: ext.name,
          version: ext.version || '',
          enabled: ext.enabled,
          description: ext.description || '',
          iconUrl: ext.icons?.[0]?.url || '',
        }));
        setLocalExtensions(formattedExtensions);
      });
    }
  }, []);

  const toggleExtension = (id: string, enabled: boolean) => {
    if (typeof chrome !== 'undefined' && chrome.management) {
      chrome.management.setEnabled(id, enabled, () => {
        setLocalExtensions((prev) =>
          prev.map((ext) =>
            ext.id === id ? { ...ext, enabled } : ext
          )
        );
      });
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
          onToggle={toggleExtension}
          onSettingsClick={handleSettingsClick}
        />
      ))}
    </div>
  );
} 