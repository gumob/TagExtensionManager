import { TagChip } from '@/components/TagChip';
import { TagEditButton } from '@/components/TagEditButton';
import { TagShowAllButton } from '@/components/TagShowAllButton';

import { useTagStore } from '../stores/tagStore';

export const TagList = () => {
  const { tags } = useTagStore();

  return (
    <div className="flex flex-wrap gap-1">
      <TagShowAllButton />
      {tags.map(tag => (
        <TagChip key={tag.id} tag={tag} />
      ))}
      <TagEditButton />
    </div>
  );
};
