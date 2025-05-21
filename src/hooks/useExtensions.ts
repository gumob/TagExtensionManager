import { Extension } from '@/types/extension';
import { getAllExtensions } from '@/utils/extensionUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Find the optimal icon from the given icons.
 * @param icons
 * @returns
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
 * The hook for managing extensions.
 * @returns
 */
export const useExtensions = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  /**
   * Refresh the extensions.
   */
  const refreshExtensions = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedExtensions = await getAllExtensions();
      console.debug('[SEM][useExtensions] Refreshing extensions state:', updatedExtensions);
      setExtensions(updatedExtensions);
      return updatedExtensions;
    } catch (error) {
      console.error('[SEM][useExtensions] Failed to refresh extensions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Watch for extension state changes.
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
        console.debug('[SEM][useExtensions] Extension updated:', details);
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
   * The filtered extensions.
   */
  const filteredExtensions = useMemo(
    () => extensions.filter(ext => ext.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [extensions, searchQuery]
  );

  /**
   * Get the current extension states.
   * @returns
   */
  const getCurrentExtensionStates = useCallback(() => {
    return extensions.map(ext => ({
      id: ext.id,
      enabled: ext.enabled,
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
