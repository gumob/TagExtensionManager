import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import React, { FC, useEffect, useRef } from 'react';

import { SearchBarComponent } from '@/components';
import { useExtensionContext } from '@/contexts';

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  /**
   * The handle search.
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!searchInputRef.current) return;
    searchInputRef.current?.focus();
  }, [searchInputRef]);

  /**
   * The ExtensionSearchBar component.
   *
   * @returns The ExtensionSearchBar component.
   */
  return (
    <SearchBarComponent
      inputRef={searchInputRef}
      value={searchQuery}
      placeholder="Search extensions..."
      onInputChange={handleSearch}
      icon={<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />}
    />
  );
};

export { ExtensionSearchBar };
