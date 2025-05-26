import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionModel } from '@/models';
import {
  useExtensionStore,
  useTagStore,
} from '@/stores';
import { logger } from '@/utils';

/**
 * The context value type for ExtensionContext.
 *
 * @property extensions - The extensions.
 * @property filteredExtensions - The filtered extensions.
 * @property taggedExtensions - The tagged extensions.
 * @property untaggedExtensions - The untagged extensions.
 * @property searchQuery - The search query.
 * @property setSearchQuery - The set search query function.
 * @property visibleTagId - The visible tag id.
 * @property setVisibleTagId - The set visible tag id function.
 * @property refreshExtensions - The refresh extensions function.
 * @property isLoading - The is loading.
 */
interface ExtensionContextValue {
  filteredExtensions: ExtensionModel[];
  taggedExtensions: Record<string, ExtensionModel[]>;
  untaggedExtensions: ExtensionModel[];
  toggleEnabled: (id: string, enabled: boolean) => Promise<void>;
  toggleLock: (id: string, locked: boolean) => Promise<void>;
  openExtensionPage: (id: string) => Promise<void>;
  openOptionsPage: (id: string) => Promise<void>;
  uninstallExtension: (id: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  visibleTagId: string | null;
  setVisibleTagId: (tagId: string | null) => void;
  refreshExtensions: () => Promise<ExtensionModel[] | undefined>;
  isLoading: boolean;
}

/**
 * The ExtensionContext.
 */
const ExtensionContext = createContext<ExtensionContextValue | null>(null);

/**
 * The props for the ExtensionProvider component.
 */
interface ExtensionProviderProps {
  /**
   * The children to render.
   */
  children: React.ReactNode;
}

/**
 * The ExtensionProvider component.
 *
 * @param children - The children to render.
 * @returns The ExtensionProvider component.
 */
export const ExtensionProvider: React.FC<ExtensionProviderProps> = ({ children }) => {
  /*******************************************************
   * State Management
   *******************************************************/

  const {
    loadExtensions,
    extensions: storedExtensions,
    toggleEnabled: toggleEnabledStore,
    toggleLock: toggleLockStore,
  } = useExtensionStore();
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

  /**
   * Refs for managing component lifecycle and preventing stale closures
   */
  const isInitialized = useRef(false);
  const isSubscribed = useRef(false);

  /*******************************************************
   * Memoized Values
   *******************************************************/

  /**
   * Memoized filtered extensions based on search query.
   */
  const filteredExtensions: ExtensionModel[] = useMemo(() => {
    return storedExtensions.filter(ext => {
      const isNameMatch = ext.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isDescriptionMatch = ext.description.toLowerCase().includes(searchQuery.toLowerCase());
      const isTextMatch = isNameMatch || isDescriptionMatch;

      const isVisible = (() => {
        if (visibleTagId === null) return true;
        if (visibleTagId === 'untagged') {
          return !extensionTags.find(
            extTag => extTag.extensionId === ext.id && extTag.tagIds.length > 0
          );
        }
        if (visibleTagId === 'enabled') return ext.enabled;
        if (visibleTagId === 'disabled') return !ext.enabled;
        return extensionTags.find(
          extTag => extTag.extensionId === ext.id && extTag.tagIds.includes(visibleTagId)
        );
      })();

      return isTextMatch && isVisible;
    });
  }, [storedExtensions, searchQuery, tags, visibleTagId, extensionTags]);

  const { taggedExtensions, untaggedExtensions } = useMemo<{
    taggedExtensions: Record<string, ExtensionModel[]>;
    untaggedExtensions: ExtensionModel[];
  }>(() => {
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
  }, [filteredExtensions]);

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
      await loadExtensions();

      logger.debug('🧯🔄 Extensions refreshed successfully', {
        group: 'ExtensionProvider',
        persist: true,
      });

      return storedExtensions;
    } catch (error) {
      logger.error(
        `🧯🛑 Failed to refresh extensions: ${error instanceof Error ? error.message : String(error)}`,
        {
          group: 'ExtensionProvider',
          persist: true,
        }
      );
      throw error;
    } finally {
      if (isSubscribed.current) {
        setIsLoading(false);
      }
    }
  }, [loadExtensions, storedExtensions]);

  const toggleEnabled = useCallback(
    async (id: string, enabled: boolean) => {
      if (!isSubscribed.current) return;
      toggleEnabledStore(id, enabled);
      refreshExtensions();
    },
    [refreshExtensions, toggleEnabledStore]
  );

  const toggleLock = useCallback(
    async (id: string, locked: boolean) => {
      if (!isSubscribed.current) return;
      toggleLockStore(id, locked);
      refreshExtensions();
    },
    [refreshExtensions, toggleLockStore]
  );

  const openExtensionPage = useCallback(async (id: string) => {
    if (!isSubscribed.current) return;
    await chromeAPI.createTab(id);
  }, []);

  const openOptionsPage = useCallback(
    async (id: string) => {
      if (!isSubscribed.current) return;
      const extension = storedExtensions.find(ext => ext.id === id);
      if (extension?.optionsUrl) {
        await chromeAPI.createTab(extension.optionsUrl);
      }
    },
    [storedExtensions]
  );

  const uninstallExtension = useCallback(
    async (id: string) => {
      if (!isSubscribed.current) return;
      await chromeAPI.uninstallExtension(id);
      refreshExtensions();
    },
    [refreshExtensions]
  );

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
        group: 'ExtensionProvider',
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
        group: 'ExtensionProvider',
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
        group: 'ExtensionProvider',
        persist: true,
      });
      refreshExtensions();
    },
    [refreshExtensions]
  );

  /*******************************************************
   * Lifecycle
   *******************************************************/

  /**
   * Main effect for initializing extension management and setting up event listeners.
   * Implements a more robust cleanup mechanism.
   */
  useEffect(() => {
    /** Initialize extensions */
    const initialize = async () => {
      logger.debug('🧯🌱 Initializing ExtensionProvider', {
        group: 'ExtensionProvider',
        persist: true,
      });
      try {
        /* Initialize stores in sequence */
        await useExtensionStore.getState().initialize();
        await useTagStore.getState().initialize();
        isInitialized.current = true;
      } catch (error) {
        logger.error('🧯🛑 Failed to initialize extensions', {
          group: 'useExtensions',
          persist: true,
        });
      }
    };
    if (!isInitialized.current) initialize();

    /** Subscribe listeners */
    if (!isSubscribed.current) {
      logger.debug('🧯🌱 Subscribing listeners', {
        group: 'ExtensionProvider',
        persist: true,
      });
      chrome.management.onEnabled.addListener(handleExtensionStateChange);
      chrome.management.onDisabled.addListener(handleExtensionStateChange);
      chrome.management.onInstalled.addListener(handleExtensionStateChange);
      chrome.management.onUninstalled.addListener(handleExtensionUninstalled);
      chrome.runtime.onInstalled.addListener(handleExtensionUpdate);
      isSubscribed.current = true;
    }

    /** Unsubscribe listeners */
    return () => {
      logger.debug('🧯🗑️ Deinitializing ExtensionProvider', {
        group: 'ExtensionProvider',
        persist: true,
      });
      chrome.management.onEnabled.removeListener(handleExtensionStateChange);
      chrome.management.onDisabled.removeListener(handleExtensionStateChange);
      chrome.management.onInstalled.removeListener(handleExtensionStateChange);
      chrome.management.onUninstalled.removeListener(handleExtensionUninstalled);
      chrome.runtime.onInstalled.removeListener(handleExtensionUpdate);
      isSubscribed.current = false;
    };
  }, []);

  /*******************************************************
   * Debugging
   *******************************************************/

  useEffect(() => {
    console.log('filteredExtensions', filteredExtensions);
    console.log('taggedExtensions', taggedExtensions);
    console.log('untaggedExtensions', untaggedExtensions);
    console.log('visibleTagId', visibleTagId);
  }, [filteredExtensions, taggedExtensions, untaggedExtensions, visibleTagId]);

  /*******************************************************
   * Exported Value
   *******************************************************/

  const value = useMemo(
    () => ({
      filteredExtensions,
      taggedExtensions,
      untaggedExtensions,
      toggleEnabled,
      toggleLock,
      openExtensionPage,
      openOptionsPage,
      uninstallExtension,
      searchQuery,
      setSearchQuery,
      visibleTagId,
      setVisibleTagId,
      refreshExtensions,
      isLoading,
    }),
    [
      filteredExtensions,
      taggedExtensions,
      untaggedExtensions,
      toggleEnabled,
      toggleLock,
      openExtensionPage,
      openOptionsPage,
      uninstallExtension,
      searchQuery,
      visibleTagId,
      refreshExtensions,
      isLoading,
    ]
  );

  return <ExtensionContext.Provider value={value}>{children}</ExtensionContext.Provider>;
};

/**
 * The useExtensionContext hook.
 *
 * @returns The ExtensionContext value.
 * @throws Error if used outside of ExtensionProvider.
 */
export const useExtensionContext = () => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error('useExtensionContext must be used within an ExtensionProvider');
  }
  return context;
};
