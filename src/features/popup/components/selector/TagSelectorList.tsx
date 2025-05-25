import { TagSelectorListItem } from '@/features/popup/components/selector';
import { TagModel } from '@/models';

interface TagSelectorListProps {
  tags: TagModel[];
  currentTagIds: string[];
  onTagClick: (tagId: string) => void;
}

export const TagSelectorList: React.FC<TagSelectorListProps> = ({
  tags,
  currentTagIds,
  onTagClick,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <TagSelectorListItem
          key={tag.id}
          tag={tag}
          isSelected={currentTagIds.includes(tag.id)}
          onClick={onTagClick}
        />
      ))}
    </div>
  );
};
