import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import { useRef } from 'react';

import { useBackup } from '@/hooks';

/**
 * The component for managing profile export/import.
 * @returns The ExtensionHeader component
 */
export const ExtensionHeader: React.FC = () => {
  const { exportFile, importFile } = useBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle the import profile event.
   * @param event - The change event
   */
  const handleImportProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await importFile(file);
  };

  return (
    <>
      <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Clean Extension Manager</h1>
      <div className="flex items-center gap-1">
        <button
          onClick={exportFile}
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
    </>
  );
};
