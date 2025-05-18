import { ExtensionList } from '@/components/ExtensionList';
import { Metrics } from '@/components/Metrics';
import { SearchBar } from '@/components/SearchBar';
import { useExtensions } from '@/hooks/useExtensions';
import React from 'react';

export const ExtensionManager: React.FC = () => {
  const { extensions, filteredExtensions, setSearchQuery, updateExtensionState } = useExtensions();

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="container mx-auto flex flex-col h-full">
        <div className="flex-none px-4 pt-4 pb-0">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Extension Manager</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
            <Metrics extensions={extensions} />
          </div>

          <div className="mb-3">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <ExtensionList
              extensions={filteredExtensions}
              onExtensionStateChange={updateExtensionState}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
