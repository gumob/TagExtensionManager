import React from 'react';

import { useTagSelectorContext } from '@/contexts';
import { TagSelectorListItem } from '@/features/popup/components/selector';

/**
 * The TagSelectorList component.
 *
 * @returns The TagSelectorList component.
 */
export const TagSelectorList: React.FC = () => {
  const { filteredTags } = useTagSelectorContext();

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => (
          <TagSelectorListItem key={tag.id} tag={tag} />
        ))}
      </div>
    </div>
  );
};
