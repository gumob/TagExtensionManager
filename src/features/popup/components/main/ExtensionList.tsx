import React, { useEffect, useState } from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionCard, ExtensionListHeader } from '@/features/popup/components/main';
import { ExtensionModel } from '@/models';
import { useExtensionStore, useTagStore } from '@/stores';

/**
 * The component for displaying a list of extensions.
 *
 * @param extensions
 * @param onExtensionStateChange
 * @param visibleTagId
 * @param setVisibleTag
 * @returns
 */
interface ExtensionListProps {
  extensions: ExtensionModel[];
  onExtensionStateChange: (id: string, enabled: boolean) => void;
  visibleTagId: string | null;
  setVisibleTag: (tagId: string | null) => void;
}

/**
 * The component for displaying a list of extensions.
 * @param extensions
 * @param onExtensionStateChange
 * @param visibleTagId
 * @param setVisibleTag
 * @returns
 */
export const ExtensionList: React.FC<ExtensionListProps> = ({
  extensions,
  onExtensionStateChange,
  visibleTagId,
  setVisibleTag,
}: ExtensionListProps) => {
  const [localExtensions, setLocalExtensions] = useState<ExtensionModel[]>(extensions);
  const { tags, extensionTags } = useTagStore();
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
    /** Update the local extensions immediately */
    setLocalExtensions(prevExtensions =>
      prevExtensions.map(ext => (ext.id === id ? { ...ext, enabled } : ext))
    );

    /** Notify the parent component */
    onExtensionStateChange(id, enabled);
  };

  /**
   * Handle the lock toggle event.
   * @param id
   * @param locked
   */
  const handleLockToggle = (id: string, locked: boolean) => {
    /** Update the local extensions immediately */
    setLocalExtensions(prevExtensions =>
      prevExtensions.map(ext => (ext.id === id ? { ...ext, locked } : ext))
    );

    /** Update the store */
    toggleLock(id);
  };

  /**
   * Handle the settings click event.
   * @param extensionId
   */
  const handleSettingsClick = async (extensionId: string) => {
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

    await chromeAPI.createTab(`${baseUrl}/?id=${extensionId}`);
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
    {} as Record<string, ExtensionModel[]>
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
          <ExtensionListHeader
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
            <ExtensionListHeader
              tag={{
                id: 'untagged',
                name: 'Untagged',
                order: -1,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
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
};
