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
   * Chrome does not reliably grant focus to the side panel document right after it opens,
   * so a single focus() call on mount is not enough. Retry focusing for a short period
   * until the document actually holds focus on the input. As a fallback for the case where
   * Chrome keeps blocking programmatic focus, move focus to the input when the user first
   * clicks inside the panel without focusing another interactive element.
   *
   * @Reference https://groups.google.com/a/chromium.org/g/chromium-extensions/c/nb058-YrrWc?pli=1
   */
  useEffect(() => {
    const input = searchInputRef.current;
    if (!input) return;

    const isInputFocused = () => document.hasFocus() && document.activeElement === input;

    const handleFirstClick = () => {
      document.removeEventListener('click', handleFirstClick, true);
      if (document.activeElement === document.body || document.activeElement === null) {
        input.focus();
      }
    };

    input.focus();
    const retryInterval = window.setInterval(() => {
      if (isInputFocused()) {
        window.clearInterval(retryInterval);
        document.removeEventListener('click', handleFirstClick, true);
        return;
      }
      input.focus();
    }, 100);
    const retryTimeout = window.setTimeout(() => {
      window.clearInterval(retryInterval);
    }, 3000);

    document.addEventListener('click', handleFirstClick, true);

    return () => {
      window.clearInterval(retryInterval);
      window.clearTimeout(retryTimeout);
      document.removeEventListener('click', handleFirstClick, true);
    };
  }, []);

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
