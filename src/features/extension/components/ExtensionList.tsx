import React, { useEffect, useState } from 'react';

import { ExtensionCard } from '@/features/extension/components/ExtensionCard';
import { ExtensionHeader } from '@/features/extension/components/ExtensionHeader';
import { useTagStore } from '@/shared/stores';
import { useExtensionStore } from '@/shared/stores';
import { Extension } from '@/shared/types';
import { logger } from '@/shared/utils';

/**
 * The component for displaying a list of extensions.
 *
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
  const { toggleLock } = useExtensionStore();

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
      logger.error('Failed to toggle extension', {
        group: 'ExtensionList',
        persist: true,
      });
      /** If an error occurs, revert to the original state */
      setLocalExtensions(extensions);
    }
  };

  /**
   * Handle the lock toggle event.
   * @param id
   * @param locked
   */
  const handleLockToggle = (id: string, locked: boolean) => {
    try {
      /** Update the local extensions immediately */
      setLocalExtensions(prevExtensions =>
        prevExtensions.map(ext => (ext.id === id ? { ...ext, locked } : ext))
      );

      /** Update the store */
      toggleLock(id);
    } catch (error) {
      logger.error('Failed to toggle lock state', {
        group: 'ExtensionList',
        persist: true,
      });
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

  /**
   * Filter extensions based on visibleTagId
   */
  const filteredExtensions = localExtensions.filter(extension => {
    if (visibleTagId === 'enabled') {
      return extension.enabled;
    } else if (visibleTagId === 'disabled') {
      return !extension.enabled;
    } else if (visibleTagId === null) {
      return true;
    } else if (visibleTagId === 'untagged') {
      return !extensionTags.find(
        extTag => extTag.extensionId === extension.id && extTag.tagIds.length > 0
      );
    } else {
      return extensionTags.find(
        extTag => extTag.extensionId === extension.id && extTag.tagIds.includes(visibleTagId)
      );
    }
  });

  /**
   * Group extensions by tag
   */
  const extensionsByTag = tags.reduce(
    (acc, tag) => {
      const tagExtensions = filteredExtensions.filter(extension =>
        extensionTags.find(
          extTag => extTag.extensionId === extension.id && extTag.tagIds.includes(tag.id)
        )
      );
      if (tagExtensions.length > 0) {
        acc[tag.id] = tagExtensions;
      }
      return acc;
    },
    {} as Record<string, Extension[]>
  );

  /**
   * Get untagged extensions
   */
  const untaggedExtensions = filteredExtensions.filter(
    ext => !extensionTags.find(extTag => extTag.extensionId === ext.id && extTag.tagIds.length > 0)
  );

  return (
    <div className="space-y-4 pb-4 pl-4 pr-3">
      {Object.entries(extensionsByTag).map(([tagId, tagExtensions]) => (
        <div key={tagId} className="space-y-2">
          <ExtensionHeader
            tag={tags.find(t => t.id === tagId)!}
            extensionCount={tagExtensions.length}
            onToggle={(enabled, extensions) => {
              extensions.forEach(ext => handleToggle(ext.id, enabled));
            }}
            extensions={tagExtensions}
          />
          <div className="grid grid-cols-2 gap-2">
            {tagExtensions
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(extension => (
                <ExtensionCard
                  key={extension.id}
                  extension={extension}
                  onToggle={handleToggle}
                  onSettingsClick={handleSettingsClick}
                  onLockToggle={handleLockToggle}
                />
              ))}
          </div>
        </div>
      ))}

      {(visibleTagId === null ||
        visibleTagId === 'untagged' ||
        visibleTagId === 'enabled' ||
        visibleTagId === 'disabled') &&
        untaggedExtensions.length > 0 && (
          <div className="space-y-2">
            <ExtensionHeader
              tag={{ id: 'untagged', name: 'Untagged', order: -1, createdAt: '', updatedAt: '' }}
              extensionCount={untaggedExtensions.length}
              onToggle={(enabled, extensions) => {
                extensions.forEach(ext => handleToggle(ext.id, enabled));
              }}
              extensions={untaggedExtensions}
            />
            <div className="grid grid-cols-2 gap-2">
              {untaggedExtensions
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(extension => (
                  <ExtensionCard
                    key={extension.id}
                    extension={extension}
                    onToggle={handleToggle}
                    onSettingsClick={handleSettingsClick}
                    onLockToggle={handleLockToggle}
                  />
                ))}
            </div>
          </div>
        )}
    </div>
  );
}
