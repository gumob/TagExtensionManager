import { ExtensionCard } from '@/components/ExtensionCard';
import { Extension } from '@/types/extension';
import React, { useEffect, useState } from 'react';

/**
 * The component for displaying a list of extensions.
 * @param extensions
 * @param onExtensionStateChange
 * @returns
 */
interface ExtensionListProps {
  extensions: Extension[];
  onExtensionStateChange: (id: string, enabled: boolean) => void;
}

/**
 * The component for displaying a list of extensions.
 * @param extensions
 * @param onExtensionStateChange
 * @returns
 */
export function ExtensionList({ extensions, onExtensionStateChange }: ExtensionListProps) {
  const [localExtensions, setLocalExtensions] = useState<Extension[]>(extensions);

  /**
   * Use effect for updating the local extensions.
   */
  useEffect(() => {
    setLocalExtensions(extensions);
  }, [extensions]);

  /**
   * Handle the toggle event.
   * @param id
   * @param enabled
   */
  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      // ローカルの状態を即座に更新
      setLocalExtensions(prevExtensions =>
        prevExtensions.map(ext => (ext.id === id ? { ...ext, enabled } : ext))
      );

      // 親コンポーネントに通知
      onExtensionStateChange(id, enabled);
    } catch (error) {
      console.error('Failed to toggle extension:', error);
      // エラーが発生した場合は元の状態に戻す
      setLocalExtensions(extensions);
    }
  };

  /**
   * Handle the settings click event.
   * @param extensionId
   */
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-4 pl-4 pr-3">
      {localExtensions.map(extension => (
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
