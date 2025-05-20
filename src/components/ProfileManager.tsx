import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import toast from 'react-hot-toast';

import { useExtensions } from '../hooks/useExtensions';
import { useExtensionStore } from '../stores/extensionStore';
import { useTagStore } from '../stores/tagStore';

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
      const currentExtensions = await refreshExtensions();
      const { tags, extensionTags } = exportTags();
      const profile = {
        extensions: currentExtensions.map(ext => ({
          id: ext.id,
          enabled: ext.enabled,
        })),
        tags,
        extensionTags,
      };

      const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `ExtensionManager-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Profile exported successfully');
    } catch (error) {
      console.error('Failed to export profile:', error);
      toast.error('Failed to export profile');
    }
  };

  /**
   * Handle the import profile event.
   */
  const handleImportProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const profile = JSON.parse(text);

      if (!profile.extensions || !profile.tags || !profile.extensionTags) {
        throw new Error('Invalid profile format');
      }

      importTags(profile.tags, profile.extensionTags);
      importExtensionStates(profile.extensions);
      await refreshExtensions();
      toast.success('Profile imported successfully');
    } catch (error) {
      console.error('Failed to import profile:', error);
      toast.error('Failed to import profile');
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleExportProfile}
        className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors"
        title="Export Profile"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors"
        title="Import Profile"
      >
        <ArrowUpTrayIcon className="w-5 h-5" />
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
