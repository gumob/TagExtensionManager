import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Profile, ProfileState } from '../types/profile';

interface ProfileStore extends ProfileState {
  addProfile: (name: string, extensions: { id: string; enabled: boolean }[]) => void;
  updateProfile: (
    id: string,
    name: string,
    extensions?: { id: string; enabled: boolean }[]
  ) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfile: (id: string) => void;
  importProfiles: (profiles: Profile[]) => void;
  exportProfiles: () => Profile[];
  initialize: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],

      // Initialize store with profiles from storage
      initialize: async () => {
        try {
          const result = await chrome.storage.local.get('extension-manager-profiles');
          const storedData = result['extension-manager-profiles'];
          if (storedData && storedData.profiles) {
            console.debug(
              '[Extension Manager][ProfileStore] Loading profiles from storage:',
              storedData
            );
            set({ profiles: storedData.profiles });
          }
        } catch (error) {
          console.error('[Extension Manager][ProfileStore] Failed to load profiles:', error);
        }
      },

      addProfile: (name, extensions) => {
        const { profiles } = get();
        const existingProfile = profiles.find(p => p.name === name);

        if (existingProfile) {
          const updatedProfiles = profiles.map(p =>
            p.id === existingProfile.id
              ? {
                  ...p,
                  extensions,
                  updatedAt: new Date().toISOString(),
                }
              : p
          );
          set({ profiles: updatedProfiles });
        } else {
          const newProfile: Profile = {
            id: uuidv4(),
            name,
            extensions,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set({ profiles: [...profiles, newProfile] });
        }
      },

      updateProfile: (
        id: string,
        name: string,
        extensions?: { id: string; enabled: boolean }[]
      ) => {
        const { profiles } = get();
        const updatedProfiles = profiles.map(p =>
          p.id === id
            ? {
                ...p,
                name,
                ...(extensions && { extensions }),
                updatedAt: new Date().toISOString(),
              }
            : p
        );
        set({ profiles: updatedProfiles });
      },

      deleteProfile: id => {
        const { profiles } = get();
        const updatedProfiles = profiles.filter(p => p.id !== id);
        set({ profiles: updatedProfiles });
      },

      setCurrentProfile: async (id: string) => {
        const { profiles } = get();
        const selectedProfile = profiles.find(p => p.id === id);
        if (selectedProfile) {
          try {
            console.debug('Selected profile:', selectedProfile);

            // 現在の拡張機能の状態を取得
            const currentExtensions = await new Promise<chrome.management.ExtensionInfo[]>(
              resolve => {
                chrome.management.getAll(extensions => resolve(extensions));
              }
            );
            console.debug('Current extensions:', currentExtensions);

            // プロファイルに含まれる拡張機能の状態を更新
            const updatePromises = currentExtensions.map(ext => {
              const profileExtension = selectedProfile.extensions.find(e => e.id === ext.id);
              console.debug(
                'Extension:',
                ext.name,
                'Profile state:',
                profileExtension?.enabled,
                'Current state:',
                ext.enabled
              );

              // プロファイルに含まれる拡張機能のみ状態を更新
              if (profileExtension) {
                return new Promise<void>((resolve, reject) => {
                  chrome.management.setEnabled(ext.id, profileExtension.enabled, () => {
                    if (chrome.runtime.lastError) {
                      console.error(
                        'Failed to update extension:',
                        ext.name,
                        chrome.runtime.lastError
                      );
                      reject(chrome.runtime.lastError);
                    } else {
                      console.debug(
                        'Successfully updated extension:',
                        ext.name,
                        'to:',
                        profileExtension.enabled
                      );
                      resolve();
                    }
                  });
                });
              }
              return Promise.resolve();
            });

            await Promise.all(updatePromises);
            console.debug('All extension updates completed');
          } catch (error) {
            console.error('Failed to update extension states:', error);
            throw error;
          }
        }
      },

      importProfiles: profiles => {
        set({ profiles });
      },

      exportProfiles: () => {
        return get().profiles;
      },
    }),
    {
      name: 'extension-manager-profiles',
      storage: {
        getItem: async name => {
          const result = await chrome.storage.local.get(name);
          const data = result[name];
          console.debug('[Extension Manager][ProfileStore] Loading from storage:', { name, data });
          return data;
        },
        setItem: async (name, value) => {
          console.debug('[Extension Manager][ProfileStore] Saving to storage:', { name, value });
          await chrome.storage.local.set({ [name]: value });
        },
        removeItem: async name => {
          console.debug('[Extension Manager][ProfileStore] Removing from storage:', name);
          await chrome.storage.local.remove(name);
        },
      },
      partialize: (state: ProfileStore) =>
        ({
          profiles: state.profiles,
        }) as ProfileState,
    }
  )
);
