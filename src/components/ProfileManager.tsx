import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import toast from 'react-hot-toast';

import { useExtensions } from '../hooks/useExtensions';
import { useFolderStore } from '../stores/folderStore';

/**
 * The component for managing profile export/import.
 * @returns
 */
export const ProfileManager = () => {
  const { refreshExtensions } = useExtensions();
  const { folders, extensions: folderExtensions, exportFolders, importFolders } = useFolderStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle the export profile event.
   */
  const handleExportProfile = async () => {
    try {
      const currentExtensions = await refreshExtensions();
      const { folders, extensions } = exportFolders();
      const profile = {
        extensions: currentExtensions.map(ext => ({
          id: ext.id,
          enabled: ext.enabled,
        })),
        folders,
        folderExtensions: extensions,
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
  const handleImportProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const importedProfile = JSON.parse(e.target?.result as string);
        if (!importedProfile.extensions || !Array.isArray(importedProfile.extensions)) {
          throw new Error('Invalid profile format');
        }
        if (!importedProfile.folders || !Array.isArray(importedProfile.folders)) {
          throw new Error('Invalid profile format: missing folders');
        }
        if (!importedProfile.folderExtensions || !Array.isArray(importedProfile.folderExtensions)) {
          throw new Error('Invalid profile format: missing folder extensions');
        }

        // Import folder structure
        importFolders(importedProfile.folders, importedProfile.folderExtensions);

        // TODO: Implement extension state import logic
        // This will be implemented in the extension store

        toast.success('Profile imported successfully');
      } catch (error) {
        console.error('Failed to import profile:', error);
        toast.error('Failed to import profile');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportProfile}
        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-500"
        title="Export current profile"
      >
        <ArrowUpTrayIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-500"
        title="Import profile"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleImportProfile}
      />
    </div>
  );
};
