import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Folder } from '@/types/folder';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TagIcon } from '@heroicons/react/24/outline';
import { TagIcon as TagSolidIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';

interface FolderSelectionDialogProps {
  folders: Folder[];
  currentFolderId: string | null;
  onClose: () => void;
  onSelectFolder: (folderId: string | null) => void;
}

export function FolderSelectionDialog({
  folders,
  currentFolderId,
  onClose,
  onSelectFolder,
}: FolderSelectionDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  // useOnClickOutside(dialogRef, () => onClose());

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-zinc-100 dark:bg-zinc-800">
      <div
        ref={dialogRef}
        className="h-full w-full flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 mb-0">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Move to Folder</h2>
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4" onClick={e => e.stopPropagation()}>
          <div className="space-y-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onSelectFolder(null);
              }}
              className="w-full text-left px-4 py-3 rounded-xl bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 flex items-center gap-3"
            >
              {currentFolderId === null ? (
                <TagSolidIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              ) : (
                <TagIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              )}
              <span className="text-zinc-900 dark:text-zinc-100">Unsorted</span>
            </button>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectFolder(folder.id);
                }}
                className="w-full text-left px-4 py-3 rounded-xl bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 flex items-center gap-3"
              >
                {currentFolderId === folder.id ? (
                  <TagSolidIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                ) : (
                  <TagIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                )}
                <span className="text-zinc-900 dark:text-zinc-100">{folder.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
