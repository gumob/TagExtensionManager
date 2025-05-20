import { useFolderStore } from '../stores/folderStore';

export const FolderShowAllButton = () => {
  const { showAllFolders } = useFolderStore();

  return (
    <button
      className="px-2 py-1 rounded-full text-2xs font-semibold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600"
      onClick={showAllFolders}
    >
      Show All
    </button>
  );
};
