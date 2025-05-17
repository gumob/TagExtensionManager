import React from 'react';

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
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onToggle(extension.id, !extension.enabled)}
            className={`px-3 py-1 rounded-full text-2xs font-medium ${
              extension.enabled
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {extension.enabled ? 'Enabled' : 'Disabled'}
          </button>
          <button
            onClick={() => onSettingsClick(extension.id)}
            className="px-3 py-1 rounded-full text-2xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
} 