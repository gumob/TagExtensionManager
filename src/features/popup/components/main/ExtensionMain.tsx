import React, { useCallback, useEffect, useState } from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import {
  ExtensionBackupMenu,
  ExtensionList,
  ExtensionSearchBar,
  ExtensionTagList,
} from '@/features/popup/components/main';
import { useExtensions } from '@/hooks';
import { logger } from '@/utils';

/**
 * The component for managing extensions.
 * @returns
 */
export const ExtensionMain: React.FC = () => {
  /**
   * The extensions and filtered extensions.
   */
  const { filteredExtensions, setSearchQuery } = useExtensions();

  /**
   * The visible tag id.
   */
  const [visibleTagId, setVisibleTagId] = useState<string | null>(null);

  /**
   * Handle the extension state change.
   * @param id
   * @param enabled
   */
  const handleExtensionStateChange = useCallback(async (id: string, enabled: boolean) => {
    logger.debug(`👩‍💼🫱 handleExtensionStateChange: ${id} ${enabled}`, {
      group: 'ExtensionMain',
      persist: true,
    });

    /** Update the extension state using Chrome API */
    await chromeAPI.toggleExtension(id, enabled);
  }, []);

  /*
   * Debugging
   */

  useEffect(() => {
    logger.debug(`👩‍💼🔍 filteredExtensions: ${filteredExtensions.length}`, {
      group: 'ExtensionMain',
      persist: true,
    });
  }, [filteredExtensions]);

  useEffect(() => {
    logger.debug(`👩‍💼🔍 visibleTagId: ${visibleTagId}`, {
      group: 'ExtensionMain',
      persist: true,
    });
  }, [visibleTagId]);

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
            <ExtensionBackupMenu />
          </div>

          <div className="mb-3">
            <ExtensionTagList
              extensions={filteredExtensions}
              visibleTagId={visibleTagId}
              setVisibleTag={setVisibleTagId}
            />
          </div>

          <div className="mb-3">
            <ExtensionSearchBar onSearch={setSearchQuery} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <ExtensionList
              extensions={filteredExtensions}
              onExtensionStateChange={handleExtensionStateChange}
              visibleTagId={visibleTagId}
              setVisibleTag={setVisibleTagId}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
