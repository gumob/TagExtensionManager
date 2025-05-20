import { Switch } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { useFolderStore } from '../stores/folderStore';
import { Folder } from '../types/folder';

interface Extension {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  iconUrl: string;
}

interface ExtensionCardProps {
  extension: Extension;
  onToggle: (id: string, enabled: boolean) => void;
  onSettingsClick: (extensionId: string) => void;
}

export function ExtensionCard({ extension, onToggle, onSettingsClick }: ExtensionCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const { folders, moveExtension } = useFolderStore();

  const handleMoveToFolder = (folderId: string | null) => {
    moveExtension(extension.id, folderId);
    setIsFolderDialogOpen(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-700 rounded-xl p-3">
      <div className="flex items-start space-x-2">
        <img
          src={extension.iconUrl}
          alt={extension.name}
          className={`w-6 h-6 rounded transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-xs font-semibold truncate select-none text-zinc-900 dark:text-white transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
          >
            {extension.name}
          </h3>
          <p
            className={`text-2xs select-none text-zinc-500 dark:text-zinc-400 transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
          >
            {extension.version}
          </p>
          {/* <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
            {extension.description}
          </p> */}
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            checked={extension.enabled}
            onChange={checked => onToggle(extension.id, checked)}
            className={`${
              extension.enabled ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
            } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                extension.enabled ? 'translate-x-5' : 'translate-x-1'
              } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-zinc-700 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsFolderDialogOpen(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600"
                  >
                    Move to Folder
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSettingsClick(extension.id);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600"
                  >
                    Manage Extension
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Folder Selection Dialog */}
      {isFolderDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Move to Folder</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleMoveToFolder(null)}
                className="w-full text-left px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-600"
              >
                Unsorted
              </button>
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => handleMoveToFolder(folder.id)}
                  className="w-full text-left px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-600"
                >
                  {folder.name}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsFolderDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
