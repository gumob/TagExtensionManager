import React from 'react';

import { useExtensionContext } from '@/contexts';
import { ExtensionCard, ExtensionListHeader } from '@/features/popup/components/main';
import { useTagStore } from '@/stores';

/**
 * The component for displaying a list of extensions.
 * @returns
 */
export const ExtensionList: React.FC = () => {
  /*******************************************************
   * State Management
   *******************************************************/

  const { taggedExtensions, untaggedExtensions, visibleTagId } = useExtensionContext();
  const { tags } = useTagStore();

  /*******************************************************
   * Render the component
   *******************************************************/

  return (
    <div className="space-y-4 pb-4 pl-4 pr-3">
      {/* Tagged Extensions */}
      {Object.entries(taggedExtensions).map(([tagId, tagExtensions]) => (
        <div key={tagId} className="space-y-2">
          {/* Header */}
          <ExtensionListHeader tag={tags.find(t => t.id === tagId)!} extensions={tagExtensions} />
          {/* Extensions */}
          <div className="grid grid-cols-2 gap-2">
            {tagExtensions
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(extension => (
                <ExtensionCard key={extension.id} extension={extension} />
              ))}
          </div>
        </div>
      ))}

      {/* Untagged Extensions */}
      {(visibleTagId === null || visibleTagId === 'untagged' || visibleTagId === 'enabled' || visibleTagId === 'disabled') && untaggedExtensions.length > 0 && (
        <div className="space-y-2">
          {/* Header */}
          <ExtensionListHeader
            tag={{
              id: 'untagged',
              name: 'Untagged',
              order: -1,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            extensions={untaggedExtensions}
          />
          {/* Extensions */}
          <div className="grid grid-cols-2 gap-2">
            {untaggedExtensions
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(extension => (
                <ExtensionCard key={extension.id} extension={extension} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
