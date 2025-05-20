import { Folder } from '../types/folder';

interface ExtensionHeaderProps {
  folder: Folder;
  extensionCount: number;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const ExtensionHeader = ({
  folder,
  extensionCount,
  isEnabled,
  onToggle,
}: ExtensionHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{folder.name}</h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">({extensionCount})</span>
      </div>
      <div className="flex">
        <button
          onClick={() => onToggle(true)}
          className={`ps-3 pe-2 py-1 text-2xs font-medium bg-zinc-200 text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300 rounded-l-full mr-[1px] hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors`}
        >
          Enable All
        </button>
        <button
          onClick={() => onToggle(false)}
          className={`ps-2 pe-3 py-1 text-2xs font-medium bg-zinc-200 text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300 rounded-r-full hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors`}
        >
          Disable All
        </button>
      </div>
    </div>
  );
};
