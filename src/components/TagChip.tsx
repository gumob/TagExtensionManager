import { useTagStore } from '../stores/tagStore';
import { Tag } from '../types/tag';

interface TagChipProps {
  tag: Tag;
  extensionCount?: number;
}

export function TagChip({ tag, extensionCount }: TagChipProps) {
  const { tags, extensionTags, setVisibleTag, visibleTagId } = useTagStore();

  const count =
    tag.id === 'untagged'
      ? (extensionCount ?? 0)
      : extensionTags.filter(extTag => extTag.tagIds.includes(tag.id)).length;
  const isSelected = visibleTagId === tag.id;

  return (
    <button
      onClick={() => setVisibleTag(isSelected ? null : tag.id)}
      className={`px-3 py-1 text-2xs font-medium rounded-full transition-colors ${
        isSelected
          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
          : visibleTagId === null
            ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 opacity-30'
      }`}
    >
      {tag.name}
      <span className="ml-1 text-2xs text-zinc-500 dark:text-zinc-400">{count}</span>
    </button>
  );
}
