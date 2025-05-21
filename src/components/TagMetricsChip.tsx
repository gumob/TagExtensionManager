import { useTagStore } from '@/stores/tagStore';
import { TagIcon } from '@heroicons/react/24/outline';

export function TagMetricsChip() {
  const { showAllTags, visibleTagId, tags, extensionTags } = useTagStore();

  const total = tags.length;
  const enabled = extensionTags.filter(extTag => extTag.tagIds.length > 0).length;
  const disabled = total - enabled;

  return (
    <div className="flex flex-row w-auto gap-[1px]">
      <button
        className="flex-1 pl-3 pr-2 py-1 rounded-s-full text-2xs font-semibold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        onClick={showAllTags}
      >
        <span className="text-2xs text-zinc-900 dark:text-white mr-1">Total</span>
        <span className="text-2xs text-blue-600 dark:text-blue-400">{total}</span>
      </button>
      <button
        className="flex-1 pl-3 pr-2 py-1 rounded-none text-2xs font-semibold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        onClick={showAllTags}
      >
        <span className="text-2xs text-zinc-900 dark:text-white mr-1">Enabled</span>
        <span className="text-2xs text-green-600 dark:text-green-400">{enabled}</span>
      </button>
      <button
        className="flex-1 pl-2 pr-3 py-1 rounded-r-full text-2xs font-semibold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        onClick={showAllTags}
      >
        <span className="text-2xs text-zinc-900 dark:text-white mr-1">Disabled</span>
        <span className="text-2xs text-red-600 dark:text-red-400">{disabled}</span>
      </button>
    </div>
  );
}
