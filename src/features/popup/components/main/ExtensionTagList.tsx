import React from 'react';

import { useExtensionContext } from '@/contexts';
import { ExtensionTagListEditButton, ExtensionTagListItem, ExtensionTagMetrics } from '@/features/popup/components/main';
import { useTagStore } from '@/stores';

/**
 * The props for the ExtensionTagList component.
 *
 * @param extensions - The extensions to display.
 */
export const ExtensionTagList: React.FC = () => {
  /**
   * The extensions and filtered extensions.
   */
  const { untaggedExtensions } = useExtensionContext();

  /**
   * The tag store.
   */
  const { tags } = useTagStore();

  /**
   * The ExtensionTagList component.
   *
   * @returns The ExtensionTagList component.
   */
  return (
    <>
      <div className="flex flex-wrap gap-1">
        <ExtensionTagMetrics />
        <ExtensionTagListEditButton />
      </div>
      <div className="flex flex-wrap gap-1">
        {/* Tagged chip */}
        {tags.map(tag => (
          <ExtensionTagListItem key={tag.id} tag={tag} />
        ))}
        {/* Untagged chip */}
        {untaggedExtensions.length > 0 && (
          <ExtensionTagListItem
            tag={{
              id: 'untagged',
              name: 'Untagged',
              order: tags.length,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
          />
        )}
      </div>
    </>
  );
};
