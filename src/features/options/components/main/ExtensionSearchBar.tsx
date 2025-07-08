import React, { useEffect, useRef } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { SearchBarComponent } from '@/components';
import { useExtensionContext } from '@/contexts';

/**
 * The ExtensionSearchBar component.
 *
 * @param onSearch - The callback to search for extensions.
 * @returns The ExtensionSearchBar component.
 */
const ExtensionSearchBar: React.FC = () => {
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

  /**
   * TODO: The function `focus()` is not working right now due to chrome bug.
   *
   * It is unclear whether this is a bug or a feature of Chrome, but the `focus()` function does not work
   * immediately after opening the side panel.
   * When the user clicks inside the side panel while isLoading is true immediately after opening the side panel,
   * focus becomes effective, so it is possible that Chrome is imposing some kind of restriction on focus operations
   * in the side panel.
   *
   * @Reference https://groups.google.com/a/chromium.org/g/chromium-extensions/c/nb058-YrrWc?pli=1
   */
  // useEffect(() => {
  //   /*
  //    * To ensure focus is correctly set in the side panel, we first focus the window,
  //    * and then focus the specific input element. A short delay is added to allow
  //    * the browser to process the window focus before the element focus is triggered.
  //    */
  //   console.debug('window', window);
  //   console.debug('document.body', document.body);
  //   window.focus();
  //   document.body.focus();
  //   document.getElementById('search-input')?.focus();
  //   setTimeout(() => {
  //     searchInputRef.current?.focus();
  //     document.getElementById('search-input')?.click();
  //     document.getElementById('search-input')?.focus();
  //     console.debug('search-input', document.getElementById('search-input'));
  //   }, 1000);
  // }, []);

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
      id="search-input"
      value={searchQuery}
      placeholder="Search extensions..."
      onInputChange={handleSearch}
      icon={<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />}
    />
  );
};

export { ExtensionSearchBar };
