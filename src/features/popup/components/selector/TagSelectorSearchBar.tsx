import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { useEffect, useRef } from 'react';

interface TagSelectorSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isOpen: boolean;
}

export function TagSelectorSearchBar({
  searchQuery,
  onSearchChange,
  isOpen,
}: TagSelectorSearchBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <div className="mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
        />
      </div>
    </div>
  );
}
