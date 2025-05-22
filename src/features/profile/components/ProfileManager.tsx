import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import { useRef } from 'react';

import { useExtensions } from '@/shared/hooks';
import { useExtensionStore, useTagStore } from '@/shared/stores';
import { logger } from '@/shared/utils';

/**
 * The component for managing profile export/import.
 * @returns
 */
export const ProfileManager = () => {
  /**
   * The use extensions hook.
   */
  const { refreshExtensions } = useExtensions();

  /**
   * The tag store.
   */
  const { exportTags, importTags } = useTagStore();

  /**
   * The extension store.
   */
  const { importExtensionStates } = useExtensionStore();

  /**
   * The file input ref.
   */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle the export profile event.
   */
  const handleExportProfile = async () => {
    try {
      const { tags, extensionTags } = exportTags();
      const { extensions } = useExtensionStore.getState();
      const profiles = {
        tags,
        extensionTags,
        extensions: extensions.map(ext => ({
          id: ext.id,
          enabled: ext.enabled,
          locked: ext.locked,
        })),
      };
      const data = JSON.stringify(profiles, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      /**
       * Generate filename with current timestamp
       */
      const now = new Date();
      const timestamp =
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        '-' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
      // now.getSeconds().toString().padStart(2, '0');
      a.download = `CleanExtensionManager-${timestamp}.json`;

      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Failed to export profile', {
        group: 'ProfileManager',
        persist: true,
      });
    }
  };

  /**
   * Handle the import profile event.
   *
   * @param event - The change event.
   */
  const handleImportProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const content = e.target?.result as string;
          const profiles = JSON.parse(content);

          /** Import tags and extension tags */
          importTags(profiles.tags, profiles.extensionTags);

          /** Import extension states */
          importExtensionStates(profiles.extensions);

          /** Refresh the extension list */
          await refreshExtensions();
        } catch (error) {
          logger.error('Failed to import profile', {
            group: 'ProfileManager',
            persist: true,
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      logger.error('Failed to import profile', {
        group: 'ProfileManager',
        persist: true,
      });
    }
  };

  /**
   * The ProfileManager component.
   *
   * @returns The ProfileManager component.
   */
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleExportProfile}
        className="pl-2 pr-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-400 dark:hover:bg-zinc-500 transition-colors"
        title="Export Profile"
      >
        <ArrowDownTrayIcon className="w-3 h-3 inline-flex mr-1" />
        <span className="text-2xs">Export</span>
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="pl-2 pr-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-400 dark:hover:bg-zinc-500 transition-colors"
        title="Import Profile"
      >
        <ArrowUpTrayIcon className="w-3 h-3 inline-flex mr-1" />
        <span className="text-2xs">Import</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportProfile}
        className="hidden"
      />
    </div>
  );
};
