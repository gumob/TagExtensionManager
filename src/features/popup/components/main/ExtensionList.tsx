import React, { useMemo } from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import { useExtensionContext } from '@/contexts/ExtensionContext';
import { ExtensionCard, ExtensionListHeader } from '@/features/popup/components/main';
import { ExtensionModel } from '@/models';
import { useTagStore } from '@/stores';
import { logger } from '@/utils';

/**
 * The component for displaying a list of extensions.
 * @param onExtensionStateChange
 * @returns
 */
interface ExtensionListProps {}

/**
 * The component for displaying a list of extensions.
 * @param onExtensionStateChange
 * @returns
 */
export const ExtensionList: React.FC<ExtensionListProps> = ({}: ExtensionListProps) => {
  /*******************************************************
   * State Management
   *******************************************************/

  const {
    extensions: { filteredExtensions, visibleTagId },
  } = useExtensionContext();
  const { tags, extensionTags } = useTagStore();

  // /**
  //  * Group extensions by tag
  //  */
  // const taggedExtensions = tags.reduce(
  //   (accumulator, tag) => {
  //     const tagExtensions = filteredExtensions.filter(extension =>
  //       extensionTags.find(
  //         extTag => extTag.extensionId === extension.id && extTag.tagIds.includes(tag.id)
  //       )
  //     );
  //     if (tagExtensions.length > 0) {
  //       accumulator[tag.id] = tagExtensions;
  //     }
  //     return accumulator;
  //   },
  //   {} as Record<string, ExtensionModel[]>
  // );

  // /**
  //  * Get untagged extensions
  //  */
  // const untaggedExtensions = filteredExtensions.filter(
  //   ext => !extensionTags.find(extTag => extTag.extensionId === ext.id && extTag.tagIds.length > 0)
  // );

  const { taggedExtensions, untaggedExtensions } = useMemo(() => {
    return {
      taggedExtensions: tags.reduce(
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
      ),
      untaggedExtensions: filteredExtensions.filter(
        extension =>
          !extensionTags.find(
            extTag => extTag.extensionId === extension.id && extTag.tagIds.length > 0
          )
      ),
    };
  }, [filteredExtensions, tags, extensionTags]);

  /*******************************************************
   * Event Handlers
   *******************************************************/

  /**
   * Handle the toggle event.
   * @param id
   * @param enabled
   */
  const handleToggle = async (id: string, enabled: boolean) => {
    /** Notify the parent component */
    logger.debug(`🗒️🫱 handleToggle: ${id} ${enabled}`, {
      group: 'ExtensionList',
      persist: true,
    });

    /** Update the extension state using Chrome API */
    await chromeAPI.toggleExtension(id, enabled);
  };

  /**
   * Handle the settings click event.
   * @param extensionId
   */
  const handleSettingsClick = async (extensionId: string) => {
    await chromeAPI.createTab(extensionId);
  };

  /**
   * Filter extensions based on visibleTagId
   */
  const _filteredExtensions = filteredExtensions.filter(extension => {
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
   * Render the component
   */
  return (
    <div className="space-y-4 pb-4 pl-4 pr-3">
      {Object.entries(taggedExtensions).map(([tagId, tagExtensions]) => (
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
                  />
                ))}
            </div>
          </div>
        )}
    </div>
  );
};
