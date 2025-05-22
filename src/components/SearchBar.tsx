import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { FC, useState } from 'react';

/**
 * The props for the SearchBar component.
 *
 * @param onSearch - The callback to search for extensions.
 */
interface SearchBarProps {
  onSearch?: (query: string) => void;
}

/**
 * The SearchBar component.
 *
 * @param onSearch - The callback to search for extensions.
 * @returns The SearchBar component.
 */
const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  /**
   * The search term.
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * The handle search.
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  /**
   * The SearchBar component.
   *
   * @returns The SearchBar component.
   */
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        placeholder="Search extensions..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full h-10 px-4 pl-10 rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
      />
    </div>
  );
};

export { SearchBar };
