import { useTagSelectorContext } from '@/contexts/TagSelectorContext';
import { TagSelectorListItem } from '@/features/popup/components/selector';

/**
 * The TagSelectorList component.
 *
 * @returns The TagSelectorList component.
 */
export const TagSelectorList: React.FC = () => {
  const { filteredTags, currentTagIds, handleTagClick } = useTagSelectorContext();

  return (
    <div className="mt-4 max-h-[60vh] overflow-y-auto">
      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => (
          <TagSelectorListItem
            key={tag.id}
            tag={tag}
            isSelected={currentTagIds.includes(tag.id)}
            onClick={handleTagClick}
          />
        ))}
      </div>
    </div>
  );
};
