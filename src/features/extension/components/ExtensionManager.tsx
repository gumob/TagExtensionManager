import React, { useCallback } from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionList, SearchBar } from '@/features/extension/components';
import { ProfileManager } from '@/features/profile/components';
import { TagList } from '@/features/tag/components';
import { useExtensions } from '@/hooks';
import { logger } from '@/utils';

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
      /** Set the manual refresh flag */
      setIsManualRefresh(true);

      /** Update the extension state using Chrome API */
      await chromeAPI.toggleExtension(id, enabled);

      /** Refresh the extension states after the update */
      await refreshExtensions();
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
            <ProfileManager />
          </div>

          <div className="mb-3">
            <TagList extensions={filteredExtensions} />
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
