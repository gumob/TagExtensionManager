import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { chromeAPI } from '@/api';
import { STORAGE_KEYS } from '@/constants';
import { mapExtensionInfoToExtensionModel } from '@/mappers';
import { ExtensionModel } from '@/models';
import { logger } from '@/utils';

/**
 * The extension store type that defines the structure and available actions for managing browser extensions.
 *
 * @property storedExtensions - Array of ExtensionModel objects representing all browser extensions
 * @property toggleEnabled - The function that toggles an extension's enabled state between true and false.
 * @property toggleLock - The function that toggles an extension's locked state between true and false.
 * @property importExtensions - The function that imports extension states from a backup file.
 * @property initialize - The function that initializes the extension store by loading the extensions from Chrome storage
 * @property isLoading - Boolean indicating whether the extension store is currently loading data
 */
interface ExtensionStore {
  initialize: () => Promise<void>;
  loadExtensions: () => Promise<void>;
  extensions: ExtensionModel[];
  toggleEnabled: (id: string, enabled: boolean) => void;
  toggleLock: (id: string, locked: boolean) => void;
  importExtensions: (extensions: ExtensionModel[]) => void;
  isLoading: boolean;
}

/**
 * Creates and exports the extension store using Zustand.
 * This store manages the state of all browser extensions including their enabled/disabled status
 * and locked state. The store is persisted to browser storage using the 'persist' middleware.
 */
export const useExtensionStore = create<ExtensionStore>()(
  persist(
    (set, get) => ({
      /**
       * Initial state with an empty extensions array
       */
      extensions: [],
      isLoading: false,

      /**
       * The function that initializes the extension store by loading the extensions from Chrome storage
       */
      initialize: async () => {
        await get().loadExtensions();
      },

      /**
       * The function that loads the extensions from Chrome storage
       */
      loadExtensions: async () => {
        try {
          set({ isLoading: true });
          logger.debug('Loading extensions from storage');

          /** Get the storage instance */
          const storedData = (await useExtensionStore.persist.getOptions().storage?.getItem(STORAGE_KEYS.EXTENSIONS))?.state;
          const storedExtensions = storedData?.extensions ?? [];

          /** Get the local extensions */
          const localExtensions = (await chromeAPI.getAllExtensions())
            .map(ext => mapExtensionInfoToExtensionModel(ext))
            .sort((a, b) => a.name.localeCompare(b.name));

          /** Update the locked state of the local extensions */
          if (storedExtensions) {
            /* Create a Map for O(1) lookup of stored extensions */
            const storedExtensionsMap = new Map(storedExtensions.map(ext => [ext.id, ext]));

            /** Update locked state in O(n) time */
            localExtensions.forEach(ext => {
              const storedExt = storedExtensionsMap.get(ext.id);
              if (storedExt) {
                ext.locked = storedExt.locked;
              }
            });
          }

          /** Update the store state */
          set({
            extensions: localExtensions,
            isLoading: false,
          });
        } catch (error) {
          logger.error('Failed to load extensions', error);
          set({ isLoading: false });
        }
      },

      /**
       * The function that toggles an extension's enabled state between true and false.
       *
       * @param id - The id of the extension.
       * @param enabled - The enabled state of the extension.
       */
      toggleEnabled: async (id, enabled) => {
        set(state => {
          /** Create a Map for O(1) lookup of stored extensions */
          const extensionsMap = new Map(state.extensions.map(ext => [ext.id, ext]));

          /** Get the target extension */
          const targetExt = extensionsMap.get(id);

          /** Update the target extension */
          if (targetExt) {
            extensionsMap.set(id, { ...targetExt, enabled });
          }

          /** Return the updated extensions */
          return {
            extensions: Array.from(extensionsMap.values()),
          };
        });

        await chromeAPI.toggleExtension(id, enabled);
      },

      /**
       * The function that toggles an extension's locked state between true and false.
       *
       * @param id - The id of the extension.
       * @param locked - The locked state of the extension.
       */
      toggleLock: async (id, locked) => {
        set(state => {
          /** Create a Map for O(1) lookup of stored extensions */
          const extensionsMap = new Map(state.extensions.map(ext => [ext.id, ext]));

          /** Get the target extension */
          const targetExt = extensionsMap.get(id);

          /** Update the target extension */
          if (targetExt) {
            extensionsMap.set(id, { ...targetExt, locked });
          }
          return {
            extensions: Array.from(extensionsMap.values()),
          };
        });
      },

      /**
       * The function that imports extension states from a backup file.
       * For each existing extension, looks for a matching imported extension
       * and updates its enabled and locked states if found.
       * Extensions not found in the import keep their current states.
       *
       * @param importedExtensions - The imported extensions.
       */
      importExtensions: importedExtensions =>
        set(extensions => ({
          extensions: extensions.extensions.map(ext => {
            const importedExt = importedExtensions.find(imp => imp.id === ext.id);
            return importedExt
              ? {
                  ...ext,
                  enabled: importedExt.enabled,
                  locked: importedExt.locked,
                }
              : ext;
          }),
        })),
    }),
    {
      name: STORAGE_KEYS.EXTENSIONS,
      partialize: state => ({
        // /** Only save the locked state of the extensions */
        // extensions: state.extensions.map(ext => ({
        //   id: ext.id,
        //   locked: ext.locked,
        // })),
        extensions: state.extensions,
      }),
      storage: {
        /**
         * Custom storage getter that loads data from Chrome storage
         * Handles errors and logs them appropriately
         */
        getItem: async (name: string) => {
          const result = await chromeAPI.getLocalStorage(name);
          return result[name];
        },
        /**
         * Custom storage setter that saves data to Chrome storage
         * Handles errors and logs them appropriately
         */
        setItem: async (name: string, value: any) => {
          await chromeAPI.setLocalStorage({ [name]: value });
        },
        /**
         * Custom storage remover that deletes data from Chrome storage
         * Handles errors and logs them appropriately
         */
        removeItem: async (name: string) => {
          await chromeAPI.removeLocalStorage(name);
        },
      },
    }
  )
);
