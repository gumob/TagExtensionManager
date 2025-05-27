import { TagIcon } from '@heroicons/react/24/outline';
import { TagIcon as TagSolidIcon } from '@heroicons/react/24/solid';

import { useTagSelectorContext } from '@/contexts';
import { TagModel } from '@/models';

interface TagSelectorListItemProps {
  tag: TagModel;
}

export const TagSelectorListItem: React.FC<TagSelectorListItemProps> = ({ tag }) => {
  const { currentTagIds, selectTag } = useTagSelectorContext();
  return (
    <button
      onClick={() => selectTag(tag.id)}
      className={`px-3 py-2 rounded-full text-xs font-medium transition-opacity ${
        currentTagIds.includes(tag.id)
          ? 'text-default bg-zinc-200 dark:bg-zinc-700'
          : 'text-default bg-chip-default opacity-50 hover:opacity-100'
      } flex items-center gap-1`}
    >
      {currentTagIds.includes(tag.id) ? (
        <TagSolidIcon className="w-4 h-4" />
      ) : (
        <TagIcon className="w-4 h-4" />
      )}
      <span className="mr-2">{tag.name}</span>
    </button>
  );
};
