import React from 'react';

import { ExtensionHeader, ExtensionList, ExtensionSearchBar, ExtensionTagList } from '@/features/popup/components/main';

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
      <div className="container mx-auto flex flex-col h-full gap-3">
        <div className="flex flex-col gap-3 px-4 pt-4 pb-0">
          <ExtensionHeader />
          <ExtensionTagList />
          <ExtensionSearchBar />
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
