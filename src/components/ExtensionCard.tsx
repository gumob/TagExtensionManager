import React from 'react';
import { Switch } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <img
          src={extension.iconUrl}
          alt={extension.name}
          className="w-6 h-6 rounded"
        />
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
            {extension.name}
          </h3>
          <p className="text-2xs text-gray-500 dark:text-gray-400">
            {extension.version}
          </p>
          {/* <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
            {extension.description}
          </p> */}
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            checked={extension.enabled}
            onChange={(checked) => onToggle(extension.id, checked)}
            className={`${
              extension.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                extension.enabled ? 'translate-x-5' : 'translate-x-1'
              } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <button
            onClick={() => onSettingsClick(extension.id)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 