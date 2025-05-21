import { useExtensions } from '@/hooks/useExtensions';
import { useExtensionStore } from '@/stores/extensionStore';
import { useTagStore } from '@/stores/tagStore';
import { logger } from '@/utils/logger';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';

/**
 * The component for managing profile export/import.
 * @returns
 */
export const ProfileManager = () => {
  const { refreshExtensions } = useExtensions();
  const { tags, extensionTags, exportTags, importTags } = useTagStore();
  const { importExtensionStates } = useExtensionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle the export profile event.
   */
  const handleExportProfile = async () => {
    try {
      const profiles = await chrome.storage.local.get('extension-manager-profiles');
      const data = JSON.stringify(profiles['extension-manager-profiles'], null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extension-manager-profiles.json';
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
          await chrome.storage.local.set({ 'extension-manager-profiles': profiles });
          window.location.reload();
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

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleExportProfile}
        className="p-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        title="Export Profile"
      >
        <ArrowDownTrayIcon className="w-3 h-3" />
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        title="Import Profile"
      >
        <ArrowUpTrayIcon className="w-3 h-3" />
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
