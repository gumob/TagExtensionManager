import { TagIcon } from '@heroicons/react/24/outline';
import { TagIcon as TagSolidIcon } from '@heroicons/react/24/solid';

import { useTagSelectorContext } from '@/contexts/TagSelectorContext';
import { TagModel } from '@/models';

interface TagSelectorListItemProps {
  tag: TagModel;
}

export const TagSelectorListItem: React.FC<TagSelectorListItemProps> = ({ tag }) => {
  const { currentTagIds, selectTag } = useTagSelectorContext();
  return (
    <button
      onClick={() => selectTag(tag.id)}
      className={`px-3 py-2 rounded-full text-xs font-semibold transition-opacity ${
        currentTagIds.includes(tag.id)
          ? 'bg-zinc-200 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100'
          : 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600'
      } flex items-center gap-1`}
    >
      {currentTagIds.includes(tag.id) ? (
        <TagSolidIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      ) : (
        <TagIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
      <span className="mr-2">{tag.name}</span>
    </button>
  );
};
