import { TagIcon } from 'lucide-react';

import { useTagStore } from '@/shared/stores/TagStore';
import { Tag } from '@/shared/types/Tag';

/**
 * The props for the TagChip component.
 *
 * @param tag - The tag to display.
 * @param extensionCount - The number of extensions with the tag.
 */
interface TagChipProps {
  tag: Tag;
  extensionCount?: number;
}

/**
 * The TagChip component.
 *
 * @param tag - The tag to display.
 * @param extensionCount - The number of extensions with the tag.
 * @returns The TagChip component.
 */
export function TagChip({ tag, extensionCount }: TagChipProps) {
  /**
   * The tag store.
   */
  const { tags, extensionTags, setVisibleTag, visibleTagId } = useTagStore();

  /**
   * The count of extensions with the tag.
   */
  const count =
    tag.id === 'untagged'
      ? (extensionCount ?? 0)
      : extensionTags.filter(extTag => extTag.tagIds.includes(tag.id)).length;
  const isSelected = visibleTagId === tag.id;

  /**
   * The TagChip component.
   *
   * @returns The TagChip component.
   */
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
      <TagIcon className="w-3 h-3 inline-flex mr-1" strokeWidth={1} />
      <span className="text-2xs">{tag.name}</span>
      <span className="ml-1 text-2xs text-zinc-500 dark:text-zinc-400">{count}</span>
    </button>
  );
}
