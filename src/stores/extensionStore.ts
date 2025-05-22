import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * The extension type.
 *
 * @property id - The id of the extension.
 * @property name - The name of the extension.
 * @property enabled - Whether the extension is enabled.
 * @property locked - Whether the extension is locked.
 */
export interface Extension {
  id: string;
  name: string;
  enabled: boolean;
  locked: boolean;
}

/**
 * The extension store type.
 *
 * @property extensions - The extensions.
 * @property setExtensions - The set extensions.
 * @property toggleExtension - The toggle extension.
 * @property toggleLock - The toggle lock.
 * @property importExtensionStates - The import extension states.
 */
interface ExtensionStore {
  extensions: Extension[];
  setExtensions: (extensions: Extension[]) => void;
  toggleExtension: (id: string) => void;
  toggleLock: (id: string) => void;
  importExtensionStates: (extensions: { id: string; enabled: boolean; locked: boolean }[]) => void;
}

/**
 * The extension store.
 *
 * @returns The extension store.
 */
export const useExtensionStore = create<ExtensionStore>()(
  persist(
    set => ({
      extensions: [],
      setExtensions: extensions => set({ extensions }),
      toggleExtension: id =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
          ),
        })),
      toggleLock: id =>
        set(state => ({
          extensions: state.extensions.map(ext =>
            ext.id === id ? { ...ext, locked: !ext.locked } : ext
          ),
        })),
      importExtensionStates: importedExtensions =>
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
