import React from 'react';

import {
  ExtensionBackupMenu,
  ExtensionList,
  ExtensionSearchBar,
  ExtensionTagList,
} from '@/features/popup/components/main';

/**
 * The component for managing extensions.
 * @returns
 */
export const ExtensionMain: React.FC = () => {
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
            <ExtensionTagList />
          </div>

          <div className="mb-3">
            <ExtensionSearchBar />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <ExtensionList />
          </div>
        </div>
      </div>
    </main>
  );
};
