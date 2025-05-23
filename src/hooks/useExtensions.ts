import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExtensionModel } from '@/models';
import { useExtensionStore } from '@/stores';
import { getAllExtensions, logger } from '@/utils';

/**
 * The custom React hook that manages browser extension states and operations.
 * This hook provides functionality to:
 * - Load and refresh extension data
 * - Filter extensions by search query
 * - Track loading states
 * - Handle extension state changes (enable/disable/install/uninstall)
 * - Manage manual vs automatic refresh behavior
 * 
 * @returns An object containing extension data and management functions
 */
export const useExtensions = () => {
  /**
   * State Management:
   * - extensions: Stores the list of all browser extensions
   * - searchQuery: Stores the current search term for filtering extensions
   * - isLoading: Tracks when extension data is being loaded/refreshed
   * - isManualRefresh: Controls whether extension updates trigger automatic refresh
   */
  const [extensions, setExtensions] = useState<ExtensionModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const { setExtensions: setStoreExtensions } = useExtensionStore();

  /**
   * The callback function that refreshes the list of extensions by:
   * 1. Setting loading state to true
   * 2. Fetching latest extension data from Chrome
   * 3. Updating both local state and global store
   * 4. Handling any errors during refresh
   * 5. Setting loading state back to false
   * 
   * This function is memoized to prevent unnecessary re-renders
   */
  const refreshExtensions = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedExtensions = await getAllExtensions();
      logger.debug('Refreshing extensions state', {
        group: 'useExtensions',
        persist: true,
      });
      setExtensions(updatedExtensions);
      /** Update the extension store with the current extensions */
      setStoreExtensions(updatedExtensions);
      return updatedExtensions;
    } catch (error) {
      logger.error('Failed to refresh extensions', {
        group: 'useExtensions',
        persist: true,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setStoreExtensions]);

  /**
   * The effect hook that:
   * 1. Loads initial extension data when component mounts
   * 2. Sets up event listeners for extension state changes:
   *    - When extensions are enabled/disabled
   *    - When extensions are installed/uninstalled
   *    - When extensions are updated
   * 3. Handles automatic vs manual refresh logic
   * 4. Cleans up event listeners when component unmounts
   */
  useEffect(() => {
    /** Get the initial state */
    refreshExtensions();

    /** Watch for extension state changes */
    const handleExtensionStateChange = () => {
      /** If manual refresh is enabled, skip automatic refresh */
      if (isManualRefresh) {
        setIsManualRefresh(false);
        return;
      }
      refreshExtensions();
    };

    /** Watch for extension updates */
    const handleExtensionUpdate = (details: chrome.runtime.InstalledDetails) => {
      if (details.reason === 'update') {
        logger.info('ExtensionModel updated', {
          group: 'useExtensions',
          persist: true,
        });
        setIsManualRefresh(true);
        refreshExtensions();
      }
    };

    /** Register event listeners */
    chrome.management.onEnabled.addListener(handleExtensionStateChange);
    chrome.management.onDisabled.addListener(handleExtensionStateChange);
    chrome.management.onInstalled.addListener(handleExtensionStateChange);
    chrome.management.onUninstalled.addListener(handleExtensionStateChange);
    chrome.runtime.onInstalled.addListener(handleExtensionUpdate);

    /** Cleanup */
    return () => {
      chrome.management.onEnabled.removeListener(handleExtensionStateChange);
      chrome.management.onDisabled.removeListener(handleExtensionStateChange);
      chrome.management.onInstalled.removeListener(handleExtensionStateChange);
      chrome.management.onUninstalled.removeListener(handleExtensionStateChange);
      chrome.runtime.onInstalled.removeListener(handleExtensionUpdate);
    };
  }, [refreshExtensions, isManualRefresh]);

  /**
   * The memoized computation that filters extensions based on search query:
   * - Converts both extension name and search query to lowercase for case-insensitive search
   * - Returns only extensions whose names contain the search query
   * - Updates automatically when extensions or search query change
   */
  const filteredExtensions = useMemo(
    () => extensions.filter(ext => ext.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [extensions, searchQuery]
  );

  /**
   * The function that returns a snapshot of current extension states:
   * - Maps through all extensions
   * - For each extension, returns an object with:
   *   - id: The extension's unique identifier
   *   - enabled: Whether the extension is currently active
   *   - locked: Whether the extension can be modified
   * 
   * This function is memoized to prevent unnecessary recalculations
   */
  const getCurrentExtensionStates = useCallback(() => {
    return extensions.map(ext => ({
      id: ext.id,
      enabled: ext.enabled,
      locked: ext.locked,
    }));
  }, [extensions]);

  return {
    extensions,
    filteredExtensions,
    searchQuery,
    setSearchQuery,
    isLoading,
    refreshExtensions,
    getCurrentExtensionStates,
    setIsManualRefresh,
  };
};
