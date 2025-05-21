import { ExtensionCard } from '@/components/ExtensionCard';
import { ExtensionHeader } from '@/components/ExtensionHeader';
import { useTagStore } from '@/stores/tagStore';
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
  const { tags, extensionTags, visibleTagId } = useTagStore();

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

  // タグごとに拡張をグループ化
  const groupedExtensions = tags.reduce(
    (acc, tag) => {
      const tagExts = localExtensions.filter(ext =>
        extensionTags.find(
          extTag => extTag.extensionId === ext.id && extTag.tagIds.includes(tag.id)
        )
      );
      if (tagExts.length > 0) {
        acc[tag.id] = tagExts;
      }
      return acc;
    },
    {} as Record<string, Extension[]>
  );

  // タグなしの拡張を取得
  const untaggedExtensions = localExtensions.filter(
    ext => !extensionTags.find(extTag => extTag.extensionId === ext.id && extTag.tagIds.length > 0)
  );

  // 表示するタグをフィルタリング
  const visibleTags = visibleTagId === null ? tags : tags.filter(tag => tag.id === visibleTagId);

  return (
    <div className="space-y-4 pb-4 pl-4 pr-3">
      {/* タグごとの拡張グループ */}
      {visibleTags.map(tag => {
        const tagExts = groupedExtensions[tag.id];
        if (!tagExts) return null;

        return (
          <div key={tag.id} className="space-y-2">
            <ExtensionHeader
              tag={tag}
              extensionCount={tagExts.length}
              onToggle={enabled => {
                tagExts.forEach(ext => handleToggle(ext.id, enabled));
              }}
              extensions={tagExts}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tagExts
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

      {/* タグなしの拡張 */}
      {(visibleTagId === null || visibleTagId === 'untagged') && untaggedExtensions.length > 0 && (
        <div className="space-y-2">
          <ExtensionHeader
            tag={{ id: 'untagged', name: 'Untagged', order: -1, createdAt: '', updatedAt: '' }}
            extensionCount={untaggedExtensions.length}
            onToggle={enabled => {
              untaggedExtensions.forEach(ext => handleToggle(ext.id, enabled));
            }}
            extensions={untaggedExtensions}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {untaggedExtensions
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
