import React, { useEffect, useState } from 'react';
import { ExtensionList } from '@/components/ExtensionList';
import { Metrics } from '@/components/Metrics';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';

interface Extension {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  iconUrl: string;
}

export default function App() {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.management) {
      chrome.management.getAll((extensions) => {
        const formattedExtensions = extensions.map((ext) => ({
          id: ext.id,
          name: ext.name,
          version: ext.version ?? '',
          enabled: ext.enabled,
          description: ext.description || '',
          iconUrl: ext.icons?.[0]?.url || '',
        }));
        setExtensions(formattedExtensions);
      });
    }
  }, []);

  const filteredExtensions = extensions.filter((ext) =>
    ext.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
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

        <ExtensionList extensions={filteredExtensions} />
      </div>
    </main>
  );
} 