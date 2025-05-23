import { useCallback, useEffect, useMemo, useState } from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionModel } from '@/models';
import { useExtensionStore } from '@/stores';
import { logger } from '@/utils';

/**
 * This function finds the best icon size for an extension from its available icons.
 * Process:
 * 1. First checks if icons exist, returns empty string if not
 * 2. Starts searching from size 48px and gradually decreases
 * 3. Returns the first matching icon URL at desired size
 * 4. If no ideal size found, falls back to the first available icon
 * 
 * @param icons - Array of available icons with different sizes
 * @returns The URL of the optimal icon
 */
const findOptimalIcon = (icons: chrome.management.IconInfo[] | undefined): string => {
  if (!icons || icons.length === 0) return '';

  /** Search for the optimal icon */
  let targetSize = 48;
  while (targetSize > 0) {
    const icon = icons.find(icon => icon.size === targetSize);
    if (icon) return icon.url;
    targetSize -= 2;
  }

  /** If no appropriate size is found, use the first icon */
  return icons[0].url;
};

/**
 * This function transforms raw Chrome extension data into our application's format.
 * Process:
 * 1. Gets stored extension data from our global store
 * 2. Checks if extension is locked in our store
 * 3. Creates a standardized extension object with:
 *    - Basic info (id, name, version)
 *    - State info (enabled, locked)
 *    - Display info (description, icon)
 * 
 * @param ext - Raw Chrome extension information
 * @returns Formatted extension data for our app
 */
export const formatExtension = (ext: chrome.management.ExtensionInfo): ExtensionModel => {
  const { extensions } = useExtensionStore.getState();
  const storedExtension = extensions.find(e => e.id === ext.id);
  const isLocked = storedExtension?.locked ?? false;

  return {
    id: ext.id,
    name: ext.name,
    version: ext.version || '',
    enabled: ext.enabled,
    description: ext.description || '',
    iconUrl: findOptimalIcon(ext.icons),
    locked: isLocked,
  };
};

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
   * State Management Setup:
   * - extensions: Main array storing all extension data
   * - searchQuery: Text used to filter extensions
   * - isLoading: Boolean flag for loading state
   * - isManualRefresh: Controls automatic vs manual updates
   * - setStoreExtensions: Function to update global store
   */
  const [extensions, setExtensions] = useState<ExtensionModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const { setExtensions: setStoreExtensions } = useExtensionStore();

  /**
   * This callback function handles refreshing the extension list.
   * Process:
   * 1. Shows loading indicator
   * 2. Fetches all extensions from Chrome API
   * 3. Formats and sorts extensions alphabetically
   * 4. Updates both local state and global store
   * 5. Logs debug information
   * 6. Handles any errors during refresh
   * 7. Removes loading indicator
   */
  const refreshExtensions = useCallback(async () => {
    try {
      setIsLoading(true);
      const extensions = await chromeAPI.getAllExtensions();
      /** Format the extensions */
      const formattedExtensions = extensions.map(formatExtension);
      /** Sort the extensions */
      formattedExtensions.sort((a, b) => a.name.localeCompare(b.name));
      logger.debug('Refreshing extensions state', {
        group: 'useExtensions',
        persist: true,
      });
      /** Update the local state with the current extensions */
      setExtensions(formattedExtensions);
      /** Update the extension store with the current extensions */
      setStoreExtensions(formattedExtensions);
      return formattedExtensions;
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
   * This effect hook manages extension state changes and updates.
   * Process:
   * 1. Initial load of extensions when component mounts
   * 2. Sets up listeners for:
   *    - Extension enable/disable events
   *    - Installation/uninstallation events
   *    - Update events
   * 3. Handles refresh logic based on manual/automatic mode
   * 4. Cleans up listeners on unmount
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
   * This memoized computation filters extensions based on search text.
   * Process:
   * 1. Takes current extensions array and search query
   * 2. Converts both extension names and search query to lowercase
   * 3. Returns only extensions whose names contain the search text
   * 4. Updates automatically when extensions or search query change
   */
  const filteredExtensions = useMemo(
    () => extensions.filter(ext => ext.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [extensions, searchQuery]
  );

  /**
   * This function creates a snapshot of current extension states.
   * Process:
   * 1. Maps through all extensions
   * 2. For each extension, captures:
   *    - Extension ID
   *    - Current enabled state
   *    - Current locked state
   * 3. Returns array of simplified state objects
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
