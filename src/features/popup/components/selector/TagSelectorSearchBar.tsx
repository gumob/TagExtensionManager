import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { useEffect, useRef } from 'react';

import { useTagSelectorContext } from '@/contexts';

/**
 * The TagSelectorSearchBar component.
 *
 * @returns The TagSelectorSearchBar component.
 */
export const TagSelectorSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useTagSelectorContext();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 icon-color-default" aria-hidden="true" />
      </div>
      <input
        ref={searchInputRef}
        type="text"
        className="flex-1 w-full h-10 pl-10 pr-3 py-1.5 input-search-bar"
        placeholder="Search tags..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
