import { useTagStore } from '../stores/tagStore';
import { Tag } from '../types/tag';

interface TagChipProps {
  tag: Tag;
}

export function TagChip({ tag }: TagChipProps) {
  const { tags, extensionTags, setVisibleTag, visibleTagId } = useTagStore();

  const extensionCount = extensionTags.filter(extTag => extTag.tagIds.includes(tag.id)).length;
  const isSelected = visibleTagId === tag.id;

  return (
    <button
      onClick={() => setVisibleTag(isSelected ? null : tag.id)}
      className={`px-3 py-1 text-2xs font-medium rounded-full transition-colors ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
          : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-500'
      }`}
    >
      {tag.name}
      {extensionCount > 0 && <span className="ml-1">({extensionCount})</span>}
    </button>
  );
}
