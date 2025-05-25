import { CheckIcon } from '@heroicons/react/24/outline';

import { useTagSelectorContext } from '@/contexts/TagSelectorContext';

/**
 * The TagSelectorList component.
 *
 * @returns The TagSelectorList component.
 */
export const TagSelectorList: React.FC = () => {
  const { filteredTags, currentTagIds, handleTagClick } = useTagSelectorContext();

  return (
    <div className="mt-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-1">
        {filteredTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none"
          >
            <span>{tag.name}</span>
            {currentTagIds.includes(tag.id) && (
              <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
