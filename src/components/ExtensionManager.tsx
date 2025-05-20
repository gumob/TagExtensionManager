import { ExtensionList } from '@/components/ExtensionList';
import { FolderList } from '@/components/FolderList';
import { Metrics } from '@/components/Metrics';
import { ProfileManager } from '@/components/ProfileManager';
import { SearchBar } from '@/components/SearchBar';
import { useExtensions } from '@/hooks/useExtensions';
import React, { useCallback } from 'react';

/**
 * The component for managing extensions.
 * @returns
 */
export const ExtensionManager: React.FC = () => {
  /**
   * The extensions and filtered extensions.
   */
  const { extensions, filteredExtensions, setSearchQuery, refreshExtensions, setIsManualRefresh } =
    useExtensions();

  /**
   * Handle the extension state change.
   * @param id
   * @param enabled
   */
  const handleExtensionStateChange = useCallback(
    async (id: string, enabled: boolean) => {
      try {
        /** Set the manual refresh flag */
        setIsManualRefresh(true);

        /** Update the extension state using Chrome API */
        await new Promise<void>((resolve, reject) => {
          chrome.management.setEnabled(id, enabled, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });

        /** Refresh the extension states after the update */
        await refreshExtensions();
      } catch (error) {
        console.error('Failed to update extension state:', error);
        /** If an error occurs, refresh the extension states */
        await refreshExtensions();
      }
    },
    [refreshExtensions, setIsManualRefresh]
  );

  /**
   * The main component.
   * @returns
   */
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="container mx-auto flex flex-col h-full">
        <div className="flex-none px-4 pt-4 pb-0">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">
              Clean Extension Manager
            </h1>
            <div className="mb-3">
              <ProfileManager />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
            <Metrics extensions={extensions} />
          </div>

          <div className="mb-3">
            <FolderList />
          </div>

          <div className="mb-3">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <ExtensionList
              extensions={filteredExtensions}
              onExtensionStateChange={handleExtensionStateChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
