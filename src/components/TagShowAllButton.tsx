import { useTagStore } from '../stores/tagStore';

export function TagShowAllButton() {
  const { showAllTags, visibleTagId } = useTagStore();

  return (
    <button
      onClick={showAllTags}
      className={`px-3 py-1 text-2xs font-medium rounded-full transition-colors ${
        visibleTagId === null
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
          : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-500'
      }`}
    >
      All
    </button>
  );
}
