import { TagsIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';

import { FC } from 'react';

import { useExtensionContext } from '@/contexts';

/**
 * The props for the ExtensionTagMetrics component.
 */
interface ExtensionTagMetricsProps {}

/**
 * The ExtensionTagMetrics component.
 *
 * @returns The ExtensionTagMetrics component.
 */
export const ExtensionTagMetrics: FC<ExtensionTagMetricsProps> = () => {
  /**
   * The extensions context.
   */
  const { filteredExtensions, setVisibleTagId } = useExtensionContext();

  /**
   * The total number of extensions.
   */
  const total = filteredExtensions.length;

  /**
   * The number of enabled extensions.
   */
  const enabled = filteredExtensions.filter(ext => ext.enabled).length;

  /**
   * The number of disabled extensions.
   */
  const disabled = total - enabled;

  /**
   * The ExtensionTagMetrics component.
   *
   * @returns The ExtensionTagMetrics component.
   */
  return (
    <div className="flex flex-row w-auto gap-[1px]">
      <button
        className="flex-1 inline-flex items-center pl-3 pr-2 py-1 rounded-s-full text-2xs bg-chip-default"
        onClick={() => setVisibleTagId(null)}
      >
        <TagsIcon className="w-4 h-4 mr-1" strokeWidth={1} />
        <span className="text-2xs mr-1">Total</span>
        <span className="text-2xs text-blue-600 dark:text-blue-400">{total}</span>
      </button>
      <button
        className="flex-1 inline-flex items-center pl-3 pr-2 py-1 rounded-none text-2xs bg-chip-default"
        onClick={() => setVisibleTagId('enabled')}
      >
        <ToggleRightIcon className="w-4 h-4 mr-1" strokeWidth={1} />
        <span className="text-2xs mr-1">Enabled</span>
        <span className="text-2xs text-green-600 dark:text-green-400">{enabled}</span>
      </button>
      <button
        className="flex-1 inline-flex items-center pl-2 pr-3 py-1 rounded-r-full text-2xs bg-chip-default"
        onClick={() => setVisibleTagId('disabled')}
      >
        <ToggleLeftIcon className="w-4 h-4 mr-1" strokeWidth={1} />
        <span className="text-2xs mr-1">Disabled</span>
        <span className="text-2xs text-red-600 dark:text-red-400">{disabled}</span>
      </button>
    </div>
  );
};
