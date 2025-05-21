import { Extension } from '@/types/extension';
import { Tag } from '@/types/tag';

interface ExtensionHeaderProps {
  tag: Tag;
  extensionCount: number;
  onToggle: (enabled: boolean) => void;
  extensions: Extension[];
}

export const ExtensionHeader = ({
  tag,
  extensionCount,
  onToggle,
  extensions,
}: ExtensionHeaderProps) => {
  const enabledCount = extensions.filter(ext => ext.enabled).length;
  const disabledCount = extensionCount - enabledCount;

  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{tag.name}</h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {enabledCount}/{extensionCount} Enabled
        </span>
      </div>
      <div className="flex items-center gap-2">
        {/* <div className="flex">
          <div className="ps-3 pe-2 py-1 text-2xs font-medium bg-zinc-200 text-blue-600 dark:bg-zinc-600 dark:text-blue-400 rounded-l-full mr-[1px]">
            {extensionCount}
          </div>
          <div className="px-2 py-1 text-2xs font-medium bg-zinc-200 text-green-600 dark:bg-zinc-600 dark:text-green-400 mr-[1px]">
            {enabledCount}
          </div>
          <div className="ps-2 pe-3 py-1 text-2xs font-medium bg-zinc-200 text-red-600 dark:bg-zinc-600 dark:text-red-400 rounded-r-full">
            {disabledCount}
          </div>
        </div> */}
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
    </div>
  );
};
