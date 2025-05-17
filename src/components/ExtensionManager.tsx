import React from 'react';
import { ExtensionList } from '@/components/ExtensionList';
import { Metrics } from '@/components/Metrics';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { useExtensions } from '@/hooks/useExtensions';

export const ExtensionManager: React.FC = () => {
  const { extensions, filteredExtensions, setSearchQuery, updateExtensionState } = useExtensions();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Extension Manager
          </h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Metrics extensions={extensions} />
        </div>

        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <ExtensionList 
          extensions={filteredExtensions} 
          onExtensionStateChange={updateExtensionState}
        />
      </div>
    </main>
  );
}; 