import { TagsIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';

import { FC, useEffect, useState } from 'react';

import { useExtensionContext } from '@/contexts/ExtensionContext';
import { ExtensionModel } from '@/models';

/**
 * The props for the ExtensionTagMetrics component.
 *
 * @param extensions - The extensions to display.
 */
interface ExtensionTagMetricsProps {
  extensions?: ExtensionModel[];
}

/**
 * The ExtensionTagMetrics component.
 *
 * @param extensions - The extensions to display.
 * @returns The ExtensionTagMetrics component.
 */
export const ExtensionTagMetrics: FC<ExtensionTagMetricsProps> = ({ extensions = [] }) => {
  const [localExtensions, setLocalExtensions] = useState(extensions);
  const {
    extensions: { setVisibleTagId },
  } = useExtensionContext();

  /**
   * The use effect for the ExtensionTagMetrics component.
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
    setVisibleTagId('enabled');
  };

  /**
   * The show disabled extensions handler.
   */
  const showDisabledExtensions = () => {
    setVisibleTagId('disabled');
  };

  /**
   * The show all extensions handler.
   */
  const showAllExtensions = () => {
    setVisibleTagId(null);
  };

  /**
   * The ExtensionTagMetrics component.
   *
   * @returns The ExtensionTagMetrics component.
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
