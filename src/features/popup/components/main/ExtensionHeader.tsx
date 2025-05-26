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
      <h1 className="text-header">Clean Extension Manager</h1>
      <div className="flex items-center gap-1">
        <button
          onClick={exportFile}
          className="pl-2 pr-3 py-1 rounded-full text-default bg-chip-default"
          title="Export Profile"
        >
          <ArrowDownTrayIcon className="w-3 h-3 inline-flex mr-1" />
          <span className="text-2xs">Export</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="pl-2 pr-3 py-1 rounded-full text-default bg-chip-default"
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
