import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ExtensionInFolder, Folder, FolderState, FolderStore } from '../types/folder';

export const useFolderStore = create<FolderStore>()(
  persist(
    (set, get) => ({
      folders: [],
      extensions: [],
      visibleFolderId: null,

      /** Initialize store with folders from storage */
      initialize: async () => {
        try {
          const result = await chrome.storage.local.get('extension-manager-folders');
          const storedData = result['extension-manager-folders'];
          if (storedData) {
            console.debug('[SEM][FolderStore] Loading folders from storage:', storedData);
            set({
              folders: storedData.folders,
              extensions: storedData.extensions,
              visibleFolderId: null,
            });
          }
        } catch (error) {
          console.error('[SEM][FolderStore] Failed to load folders:', error);
        }
      },

      /** Set visible folder */
      setVisibleFolder: (folderId: string | null) => {
        set({ visibleFolderId: folderId });
      },

      /** Show all folders */
      showAllFolders: () => {
        set({ visibleFolderId: null });
      },

      /** Add a folder */
      addFolder: (name: string) => {
        const { folders } = get();
        const newFolder: Folder = {
          id: uuidv4(),
          name,
          order: folders.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ folders: [...folders, newFolder] });
      },

      /** Update a folder */
      updateFolder: (id: string, name: string) => {
        const { folders } = get();
        const updatedFolders = folders.map(folder =>
          folder.id === id
            ? {
                ...folder,
                name,
                updatedAt: new Date().toISOString(),
              }
            : folder
        );
        set({ folders: updatedFolders });
      },

      /** Delete a folder */
      deleteFolder: (id: string) => {
        const { folders, extensions } = get();
        const updatedFolders = folders.filter(folder => folder.id !== id);
        const updatedExtensions = extensions.map(ext =>
          ext.folderId === id ? { ...ext, folderId: null } : ext
        );
        set({ folders: updatedFolders, extensions: updatedExtensions });
      },

      /** Reorder folders */
      reorderFolders: (folderIds: string[]) => {
        const { folders } = get();
        const updatedFolders = folderIds
          .map((id, index) => {
            const folder = folders.find(f => f.id === id);
            if (!folder) return null;
            return {
              ...folder,
              order: index,
              updatedAt: new Date().toISOString(),
            };
          })
          .filter((folder): folder is Folder => folder !== null);
        set({ folders: updatedFolders });
      },

      /** Move extension to folder */
      moveExtension: (extensionId: string, folderId: string | null) => {
        const { extensions } = get();
        const existingExtension = extensions.find(ext => ext.id === extensionId);
        if (existingExtension) {
          const updatedExtensions = extensions.map(ext =>
            ext.id === extensionId ? { ...ext, folderId } : ext
          );
          set({ extensions: updatedExtensions });
        } else {
          set({ extensions: [...extensions, { id: extensionId, folderId }] });
        }
      },

      /** Import folders and extensions */
      importFolders: (folders: Folder[], extensions: ExtensionInFolder[]) => {
        set({ folders, extensions });
      },

      /** Export folders and extensions */
      exportFolders: () => {
        const { folders, extensions } = get();
        return { folders, extensions };
      },
    }),
    {
      name: 'extension-manager-folders',
      storage: {
        getItem: async name => {
          const result = await chrome.storage.local.get(name);
          const data = result[name];
          console.debug('[SEM][FolderStore] Loading from storage:', { name, data });
          return data;
        },
        setItem: async (name, value) => {
          console.debug('[SEM][FolderStore] Saving to storage:', { name, value });
          await chrome.storage.local.set({ [name]: value });
        },
        removeItem: async name => {
          console.debug('[SEM][FolderStore] Removing from storage:', name);
          await chrome.storage.local.remove(name);
        },
      },
      partialize: (state: FolderStore) =>
        ({
          folders: state.folders,
          extensions: state.extensions,
        }) as FolderState,
    }
  )
);
