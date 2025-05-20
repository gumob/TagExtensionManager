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
          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 opacity-30'
      }`}
    >
      {tag.name}
      {extensionCount > 0 && <span className="ml-1">({extensionCount})</span>}
    </button>
  );
}
