import { useState } from 'react';

import { ExtensionInFolder, Folder } from '../types/folder';

interface FolderChipProps {
  folder: Folder;
  extensions: ExtensionInFolder[];
}

export const FolderChip = ({ folder, extensions }: FolderChipProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const extensionCount = extensions.filter(ext => ext.folderId === folder.id).length;

  return (
    <button
      className={`px-2 py-1 rounded-full text-2xs font-semibold transition-opacity ${
        isVisible
          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600'
          : 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 opacity-30'
      }`}
      onClick={() => setIsVisible(!isVisible)}
    >
      <p className="flex items-center gap-1">
        <span>{folder.name}</span>
        <span className="font-normal text-zinc-500 dark:text-zinc-400">({extensionCount})</span>
      </p>
    </button>
  );
};
