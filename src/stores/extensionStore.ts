import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Extension {
  id: string;
  name: string;
  enabled: boolean;
  locked: boolean;
}

interface ExtensionStore {
  extensions: Extension[];
  setExtensions: (extensions: Extension[]) => void;
  toggleExtension: (id: string) => void;
  toggleLock: (id: string) => void;
  importExtensionStates: (extensions: { id: string; enabled: boolean; locked: boolean }[]) => void;
}

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
