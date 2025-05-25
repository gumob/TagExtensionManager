import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { useEffect, useRef } from 'react';

import { useTagSelectorContext } from '@/contexts';

/**
 * The TagSelectorSearchBar component.
 *
 * @returns The TagSelectorSearchBar component.
 */
export const TagSelectorSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, isOpen } = useTagSelectorContext();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <div className="relative mt-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 bg-white dark:bg-zinc-800"
        placeholder="Search tags..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
