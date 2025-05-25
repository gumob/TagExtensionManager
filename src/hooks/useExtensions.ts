import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionModel } from '@/models';
import { useExtensionStore, useTagStore } from '@/stores';
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
 * @param storedExtensions - Current extensions from the store
 * @returns Formatted extension data for our app
 */
export const formatExtension = (
  ext: chrome.management.ExtensionInfo,
  storedExtensions: ExtensionModel[]
): ExtensionModel => {
  const storedExtension = storedExtensions.find(e => e.id === ext.id);
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
 * Custom hook for managing extension state and operations.
 * Implements a more robust architecture with clear separation of concerns.
 */
export const useExtensions = () => {
  /*******************************************************
   * State Management
   *******************************************************/

  const [extensions, setExtensions] = useState<ExtensionModel[]>([]);
  const { extensions: storedExtensions, setExtensions: setStoreExtensions } = useExtensionStore();
  const [filteredExtensions, setFilteredExtensions] = useState<ExtensionModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { tags, extensionTags } = useTagStore();

  /**
   * The visible tag.
   */
  const [visibleTagId, setVisibleTagId] = useState<string | null>(null);

  /**
   * The is loading.
   */
  const [isLoading, setIsLoading] = useState(false);
  // Refs for managing component lifecycle and preventing stale closures
  const isSubscribed = useRef(true);
  const isInitialized = useRef(false);
  const storedExtensionsRef = useRef(storedExtensions);

  // Update ref when storedExtensions changes
  useEffect(() => {
    storedExtensionsRef.current = storedExtensions;
  }, [storedExtensions]);

  /*******************************************************
   * Core Function
   *******************************************************/

  /**
   * Core function for refreshing extension data.
   * Implements a more robust error handling and state management.
   */
  const refreshExtensions = useCallback(async () => {
    if (!isSubscribed.current) return;

    try {
      setIsLoading(true);
      const rawExtensions = await chromeAPI.getAllExtensions();

      // Format and sort extensions
      const formattedExtensions = rawExtensions
        .map(ext => formatExtension(ext, storedExtensionsRef.current))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Batch state updates
      setExtensions(formattedExtensions);
      setStoreExtensions(formattedExtensions);

      logger.debug('🧯🔄 Extensions refreshed successfully', {
        group: 'useExtensions',
        persist: true,
      });

      return formattedExtensions;
    } catch (error) {
      logger.error(
        `🧯🛑 Failed to refresh extensions: ${error instanceof Error ? error.message : String(error)}`,
        {
          group: 'useExtensions',
          persist: true,
        }
      );
      throw error;
    } finally {
      if (isSubscribed.current) {
        setIsLoading(false);
      }
    }
  }, [setStoreExtensions]);

  /*******************************************************
   * Event Handlers
   *******************************************************/

  /**
   * Event handlers for extension state changes.
   * Implemented as stable callbacks to prevent unnecessary re-renders.
   */
  const handleExtensionStateChange = useCallback(
    (info: chrome.management.ExtensionInfo) => {
      if (!isSubscribed.current) return;
      logger.debug(`🧯🫱 Extension state changed: ${info.name}`, {
        group: 'useExtensions',
        persist: true,
      });
      refreshExtensions();
    },
    [refreshExtensions]
  );

  /**
   * Handle the extension uninstalled event.
   * @param id
   */
  const handleExtensionUninstalled = useCallback(
    (id: string) => {
      if (!isSubscribed.current) return;
      logger.debug(`🧯🫱 Extension uninstalled: ${id}`, {
        group: 'useExtensions',
        persist: true,
      });
      refreshExtensions();
    },
    [refreshExtensions]
  );

  /**
   * Handle the extension updated event.
   * @param details
   */
  const handleExtensionUpdate = useCallback(
    (details: chrome.runtime.InstalledDetails) => {
      if (!isSubscribed.current || details.reason !== 'update') return;
      logger.debug(`🧯🫱 Extension updated: ${details.id}`, {
        group: 'useExtensions',
        persist: true,
      });
      refreshExtensions();
    },
    [refreshExtensions]
  );

  /**
   * Main effect for initializing extension management and setting up event listeners.
   * Implements a more robust cleanup mechanism.
   */
  useEffect(() => {
    // Initialize extensions
    const initialize = async () => {
      if (!isInitialized.current && isSubscribed.current) {
        logger.debug('🧯🌱 Initializing useExtensions hook', {
          group: 'useExtensions',
          persist: true,
        });
        await refreshExtensions();
        isInitialized.current = true;
      }
    };

    initialize();

    // Register event listeners
    if (isSubscribed.current) {
      chrome.management.onEnabled.addListener(handleExtensionStateChange);
      chrome.management.onDisabled.addListener(handleExtensionStateChange);
      chrome.management.onInstalled.addListener(handleExtensionStateChange);
      chrome.management.onUninstalled.addListener(handleExtensionUninstalled);
      chrome.runtime.onInstalled.addListener(handleExtensionUpdate);
    }

    // Cleanup function
    return () => {
      logger.debug('🧯🗑️ Deinitializing useExtensions hook', {
        group: 'useExtensions',
        persist: true,
      });
      isSubscribed.current = false;
      chrome.management.onEnabled.removeListener(handleExtensionStateChange);
      chrome.management.onDisabled.removeListener(handleExtensionStateChange);
      chrome.management.onInstalled.removeListener(handleExtensionStateChange);
      chrome.management.onUninstalled.removeListener(handleExtensionUninstalled);
      chrome.runtime.onInstalled.removeListener(handleExtensionUpdate);
    };
  }, [
    refreshExtensions,
    handleExtensionStateChange,
    handleExtensionUninstalled,
    handleExtensionUpdate,
  ]);

  /**
   * Memoized filtered extensions based on search query.
   */
  useEffect(() => {
    const filteredExtensions = extensions.filter((ext, index) => {
      const isNameMatch = ext.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isDescriptionMatch = ext.description.toLowerCase().includes(searchQuery.toLowerCase());
      const isTextMatch = isNameMatch || isDescriptionMatch;
      const isVisible =
        visibleTagId === null ||
        visibleTagId === 'untagged' ||
        visibleTagId === 'enabled' ||
        visibleTagId === 'disabled';
      // logger.debug(
      //   `🧯🔄 filter[${index}] extension: ${ext.name} isTextMatch: ${isTextMatch} isVisible: ${isVisible}`,
      //   {
      //     group: 'useExtensions',
      //     persist: true,
      //   }
      // );
      return isTextMatch;
    });
    setFilteredExtensions(filteredExtensions);
  }, [extensions, searchQuery]);

  // /**
  //  * Group extensions by tag
  //  */
  // const taggedExtensions = tags.reduce(
  //   (accumulator, tag) => {
  //     const tagExtensions = filteredExtensions.filter(extension =>
  //       extensionTags.find(
  //         extTag => extTag.extensionId === extension.id && extTag.tagIds.includes(tag.id)
  //       )
  //     );
  //     if (tagExtensions.length > 0) {
  //       accumulator[tag.id] = tagExtensions;
  //     }
  //     return accumulator;
  //   },
  //   {} as Record<string, ExtensionModel[]>
  // );

  // /**
  //  * Get untagged extensions
  //  */
  // const untaggedExtensions = filteredExtensions.filter(
  //   ext => !extensionTags.find(extTag => extTag.extensionId === ext.id && extTag.tagIds.length > 0)
  // );

  const { taggedExtensions, untaggedExtensions } = useMemo(() => {
    return {
      taggedExtensions: tags.reduce(
        (acc, tag) => {
          const tagExtensions = filteredExtensions.filter(extension =>
            extensionTags.find(
              extTag => extTag.extensionId === extension.id && extTag.tagIds.includes(tag.id)
            )
          );
          if (tagExtensions.length > 0) {
            acc[tag.id] = tagExtensions;
          }
          return acc;
        },
        {} as Record<string, ExtensionModel[]>
      ),
      untaggedExtensions: filteredExtensions.filter(
        extension =>
          !extensionTags.find(
            extTag => extTag.extensionId === extension.id && extTag.tagIds.length > 0
          )
      ),
    };
  }, [filteredExtensions, tags, extensionTags]);

  /*******************************************************
   * Debugging
   *******************************************************/

  useEffect(() => {
    logger.debug(`🧯🐛 Filtered extensions: ${filteredExtensions.length}`, {
      group: 'useExtensions',
      persist: true,
    });
  }, [filteredExtensions]);

  /*******************************************************
   * Return
   *******************************************************/

  return {
    extensions,
    filteredExtensions,
    taggedExtensions,
    untaggedExtensions,
    searchQuery,
    setSearchQuery,
    visibleTagId,
    setVisibleTagId,
    refreshExtensions,
    isLoading,
  };
};
