import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ExtensionModel } from '@/models';

/**
 * The extension store type that defines the structure and available actions for managing browser extensions.
 *
 * @property extensions - Array of ExtensionModel objects representing all browser extensions
 * @property setExtensions - Function to completely replace the extensions array with a new one
 * @property toggleExtension - Function to toggle an extension's enabled/disabled state
 * @property toggleLock - Function to toggle whether an extension is locked (protected from state changes)
 * @property importExtensions - Function to import and merge extension states from a backup
 */
interface ExtensionStore {
  extensions: ExtensionModel[];
  setExtensions: (extensions: ExtensionModel[]) => void;
  toggleExtension: (id: string) => void;
  toggleLock: (id: string) => void;
  importExtensions: (extensions: ExtensionModel[]) => void;
}

/**
 * Creates and exports the extension store using Zustand.
 * This store manages the state of all browser extensions including their enabled/disabled status
 * and locked state. The store is persisted to browser storage using the 'persist' middleware.
 */
export const useExtensionStore = create<ExtensionStore>()(
  persist(
    set => ({
      /**
       * Initial state with an empty extensions array
       */
      extensions: [],

      /**
       * Replaces the entire extensions array with a new one.
       * Used when first loading extensions or after a complete refresh.
       */
      setExtensions: extensions => set({ extensions }),

      /**
       * Toggles an extension's enabled state between true and false.
       * Finds the extension by ID and flips its 'enabled' property while preserving other properties.
       */
      toggleExtension: id =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
          ),
        })),

      /**
       * Toggles an extension's locked state between true and false.
       * Locked extensions are protected from automatic state changes.
       * Finds the extension by ID and flips its 'locked' property while preserving other properties.
       */
      toggleLock: id =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === id ? { ...ext, locked: !ext.locked } : ext
          ),
        })),

      /**
       * Imports extension states from a backup file.
       * For each existing extension, looks for a matching imported extension
       * and updates its enabled and locked states if found.
       * Extensions not found in the import keep their current states.
       */
      importExtensions: importedExtensions =>
        set(state => ({
          extensions: state.extensions.map(ext => {
            const importedExt = importedExtensions.find(imp => imp.id === ext.id);
            return importedExt
              ? { ...ext, enabled: importedExt.enabled, locked: importedExt.locked }
              : ext;
          }),
        })),
    }),
    {
      name: 'extension-manager-extensions',
    }
  )
);
