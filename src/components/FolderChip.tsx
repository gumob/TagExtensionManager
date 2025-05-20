import { useFolderStore } from '../stores/folderStore';
import { ExtensionInFolder, Folder } from '../types/folder';

interface FolderChipProps {
  folder: Folder;
  extensions: ExtensionInFolder[];
}

export const FolderChip = ({ folder, extensions }: FolderChipProps) => {
  const { visibleFolderId, setVisibleFolder } = useFolderStore();
  const extensionCount = extensions.filter(ext => ext.folderId === folder.id).length;
  const isActive = visibleFolderId === folder.id;

  const handleClick = () => {
    if (isActive) {
      setVisibleFolder(null); // 現在のフォルダーがアクティブな場合は全て表示
    } else {
      setVisibleFolder(folder.id); // 他のフォルダーをクリックした場合はそのフォルダーのみ表示
    }
  };

  return (
    <button
      className={`px-2 py-1 rounded-full text-2xs font-semibold transition-opacity ${
        isActive
          ? 'bg-zinc-200 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100'
          : visibleFolderId === null
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600'
            : 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 opacity-30'
      }`}
      onClick={handleClick}
    >
      <p className="flex items-center gap-1">
        <span>{folder.name}</span>
        <span className="font-normal text-zinc-500 dark:text-zinc-400">({extensionCount})</span>
      </p>
    </button>
  );
};
