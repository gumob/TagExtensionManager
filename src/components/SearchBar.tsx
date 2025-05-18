import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { FC, useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

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
        className="w-full h-10 px-4 pl-10 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200"
      />
    </div>
  );
};

export { SearchBar };
