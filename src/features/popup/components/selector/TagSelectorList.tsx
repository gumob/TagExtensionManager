import { TagSelectorListItem } from '@/features/popup/components/selector';
import { TagModel } from '@/models';

interface TagSelectorListProps {
  tags: TagModel[];
  selectedTagIds: string[];
  onTagClick: (tagId: string) => void;
}

export function TagSelectorList({ tags, selectedTagIds, onTagClick }: TagSelectorListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <TagSelectorListItem
          key={tag.id}
          tag={tag}
          isSelected={selectedTagIds.includes(tag.id)}
          onClick={onTagClick}
        />
      ))}
    </div>
  );
}
