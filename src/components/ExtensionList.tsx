import { ExtensionCard } from '@/components/ExtensionCard';
import { ExtensionHeader } from '@/components/ExtensionHeader';
import { useFolderStore } from '@/stores/folderStore';
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
  const { folders, extensions: folderExtensions, visibleFolderId } = useFolderStore();

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
      /** Update the local extensions immediately */
      setLocalExtensions(prevExtensions =>
        prevExtensions.map(ext => (ext.id === id ? { ...ext, enabled } : ext))
      );

      /** Notify the parent component */
      onExtensionStateChange(id, enabled);
    } catch (error) {
      console.error('Failed to toggle extension:', error);
      /** If an error occurs, revert to the original state */
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

  // フォルダごとに拡張をグループ化
  const groupedExtensions = folders.reduce(
    (acc, folder) => {
      const folderExts = localExtensions.filter(ext =>
        folderExtensions.find(fe => fe.id === ext.id && fe.folderId === folder.id)
      );
      if (folderExts.length > 0) {
        acc[folder.id] = folderExts;
      }
      return acc;
    },
    {} as Record<string, Extension[]>
  );

  // Unsortedの拡張を取得
  const unsortedExtensions = localExtensions.filter(
    ext => !folderExtensions.find(fe => fe.id === ext.id && fe.folderId !== null)
  );

  // 表示するフォルダーをフィルタリング
  const visibleFolders =
    visibleFolderId === null ? folders : folders.filter(folder => folder.id === visibleFolderId);

  return (
    <div className="space-y-4 pb-4 pl-4 pr-3">
      {/* フォルダごとの拡張グループ */}
      {visibleFolders.map(folder => {
        const folderExts = groupedExtensions[folder.id];
        if (!folderExts) return null;

        return (
          <div key={folder.id} className="space-y-2">
            <ExtensionHeader
              folder={folder}
              extensionCount={folderExts.length}
              onToggle={enabled => {
                folderExts.forEach(ext => handleToggle(ext.id, enabled));
              }}
              extensions={folderExts}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {folderExts
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(extension => (
                  <ExtensionCard
                    key={extension.id}
                    extension={extension}
                    onToggle={handleToggle}
                    onSettingsClick={handleSettingsClick}
                  />
                ))}
            </div>
          </div>
        );
      })}

      {/* Unsortedの拡張 */}
      {visibleFolderId === null && unsortedExtensions.length > 0 && (
        <div className="space-y-2">
          <ExtensionHeader
            folder={{ id: 'unsorted', name: 'Unsorted', order: -1, createdAt: '', updatedAt: '' }}
            extensionCount={unsortedExtensions.length}
            onToggle={enabled => {
              unsortedExtensions.forEach(ext => handleToggle(ext.id, enabled));
            }}
            extensions={unsortedExtensions}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {unsortedExtensions
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(extension => (
                <ExtensionCard
                  key={extension.id}
                  extension={extension}
                  onToggle={handleToggle}
                  onSettingsClick={handleSettingsClick}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
