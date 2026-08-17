import React from 'react';

import { useExtensionContext } from '@/contexts';
import { ExtensionTagListEditButton, ExtensionTagListItem, ExtensionTagMetrics, ExtensionToggleAllButtons } from '@/features/options/components/main';
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
      {/*
       * Global scope row: state metrics followed by whole-list bulk actions.
       * All chips share one wrapping flex row so they sit on a single line on
       * wide layouts and fold chip-by-chip on narrow side panels.
       */}
      <div className="flex flex-wrap gap-1">
        <ExtensionTagMetrics />
        <ExtensionToggleAllButtons />
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
