import { TagsIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';

import { FC, useEffect, useState } from 'react';

import { ExtensionModel } from '@/models';
import { useTagStore } from '@/stores';

/**
 * The props for the ExtensionTagMetricsChip component.
 *
 * @param extensions - The extensions to display.
 * @param visibleTagId - The id of the visible tag.
 * @param setVisibleTag - The function to set the visible tag.
 */
interface ExtensionTagMetricsChipProps {
  extensions?: ExtensionModel[];
  visibleTagId: string | null;
  setVisibleTag: (tagId: string | null) => void;
}

/**
 * The ExtensionTagMetricsChip component.
 *
 * @param extensions - The extensions to display.
 * @param visibleTagId - The id of the visible tag.
 * @param setVisibleTag - The function to set the visible tag.
 * @returns The ExtensionTagMetricsChip component.
 */
export const ExtensionTagMetricsChip: FC<ExtensionTagMetricsChipProps> = ({
  extensions = [],
  visibleTagId,
  setVisibleTag,
}) => {
  const [localExtensions, setLocalExtensions] = useState(extensions);

  /**
   * The use effect for the ExtensionTagMetricsChip component.
   */
  useEffect(() => {
    setLocalExtensions(extensions);
  }, [extensions]);

  /**
   * The total number of extensions.
   */
  const total = localExtensions.length;

  /**
   * The number of enabled extensions.
   */
  const enabled = localExtensions.filter(ext => ext.enabled).length;

  /**
   * The number of disabled extensions.
   */
  const disabled = total - enabled;

  /**
   * The show enabled extensions handler.
   */
  const showEnabledExtensions = () => {
    setVisibleTag('enabled');
  };

  /**
   * The show disabled extensions handler.
   */
  const showDisabledExtensions = () => {
    setVisibleTag('disabled');
  };

  /**
   * The show all extensions handler.
   */
  const showAllExtensions = () => {
    setVisibleTag(null);
  };

  /**
   * The ExtensionTagMetricsChip component.
   *
   * @returns The ExtensionTagMetricsChip component.
   */
  return (
    <div className="flex flex-row w-auto gap-[1px]">
      <button
        className="flex-1 pl-3 pr-2 py-1 rounded-s-full text-2xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 inline-flex items-center"
        onClick={showAllExtensions}
      >
        <TagsIcon className="w-4 h-4 mr-1" strokeWidth={1} />
        <span className="text-2xs text-zinc-900 dark:text-white mr-1">Total</span>
        <span className="text-2xs text-blue-600 dark:text-blue-400">{total}</span>
      </button>
      <button
        className="flex-1 pl-3 pr-2 py-1 rounded-none text-2xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 inline-flex items-center"
        onClick={showEnabledExtensions}
      >
        <ToggleRightIcon className="w-4 h-4 mr-1" strokeWidth={1} />
        <span className="text-2xs text-zinc-900 dark:text-white mr-1">Enabled</span>
        <span className="text-2xs text-green-600 dark:text-green-400">{enabled}</span>
      </button>
      <button
        className="flex-1 pl-2 pr-3 py-1 rounded-r-full text-2xs bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 inline-flex items-center"
        onClick={showDisabledExtensions}
      >
        <ToggleLeftIcon className="w-4 h-4 mr-1" strokeWidth={1} />
        <span className="text-2xs text-zinc-900 dark:text-white mr-1">Disabled</span>
        <span className="text-2xs text-red-600 dark:text-red-400">{disabled}</span>
      </button>
    </div>
  );
};
