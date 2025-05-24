import { ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';

import { FC, useEffect, useState } from 'react';

import { ExtensionModel } from '@/models';
import { useTagStore } from '@/stores';

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
  const { visibleTagId, setVisibleTag } = useTagStore();
  const [enabledCount, setEnabledCount] = useState(0);
  const [disabledCount, setDisabledCount] = useState(0);

  useEffect(() => {
    setEnabledCount(extensions.filter(ext => ext.enabled).length);
    setDisabledCount(extensions.filter(ext => !ext.enabled).length);
  }, [extensions]);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setVisibleTag(visibleTagId === 'enabled' ? null : 'enabled')}
        className={`px-3 py-1 text-2xs font-medium rounded-full transition-colors ${
          visibleTagId === 'enabled'
            ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
            : visibleTagId === null
              ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 opacity-30'
        }`}
      >
        <ToggleRightIcon className="w-3 h-3 inline-flex mr-1" strokeWidth={1} />
        <span className="text-2xs">Enabled</span>
        <span className="ml-1 text-2xs text-zinc-500 dark:text-zinc-400">{enabledCount}</span>
      </button>
      <button
        onClick={() => setVisibleTag(visibleTagId === 'disabled' ? null : 'disabled')}
        className={`px-3 py-1 text-2xs font-medium rounded-full transition-colors ${
          visibleTagId === 'disabled'
            ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
            : visibleTagId === null
              ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 opacity-30'
        }`}
      >
        <ToggleLeftIcon className="w-3 h-3 inline-flex mr-1" strokeWidth={1} />
        <span className="text-2xs">Disabled</span>
        <span className="ml-1 text-2xs text-zinc-500 dark:text-zinc-400">{disabledCount}</span>
      </button>
    </div>
  );
};
