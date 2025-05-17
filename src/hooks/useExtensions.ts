import { useState, useEffect } from 'react';
import { Extension } from '@/types/extension';

export const useExtensions = () => {
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

  return {
    extensions,
    filteredExtensions,
    searchQuery,
    setSearchQuery,
  };
}; 