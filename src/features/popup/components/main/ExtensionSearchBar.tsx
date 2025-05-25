import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import React, { FC } from 'react';

import { useExtensionContext } from '@/contexts/ExtensionContext';

/**
 * The props for the ExtensionSearchBar component.
 */
interface ExtensionSearchBarProps {}

/**
 * The ExtensionSearchBar component.
 *
 * @param onSearch - The callback to search for extensions.
 * @returns The ExtensionSearchBar component.
 */
const ExtensionSearchBar: FC<ExtensionSearchBarProps> = () => {
  /**
   * The extensions and filtered extensions.
   */
  const { searchQuery, setSearchQuery } = useExtensionContext();

  /**
   * The handle search.
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * The ExtensionSearchBar component.
   *
   * @returns The ExtensionSearchBar component.
   */
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        placeholder="Search extensions..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full h-10 px-4 pl-10 rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
      />
    </div>
  );
};

export { ExtensionSearchBar };
