import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ExtensionModel } from '@/models';

/**
 * The extension store type.
 *
 * @property extensions - The extensions.
 * @property setExtensions - The set extensions.
 * @property toggleExtension - The toggle extension.
 * @property toggleLock - The toggle lock.
 * @property importExtensions - The import extension states.
 */
interface ExtensionStore {
  extensions: ExtensionModel[];
  setExtensions: (extensions: ExtensionModel[]) => void;
  toggleExtension: (id: string) => void;
  toggleLock: (id: string) => void;
  importExtensions: (extensions: ExtensionModel[]) => void;
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
