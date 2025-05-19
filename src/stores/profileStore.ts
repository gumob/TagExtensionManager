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
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfileId: null,

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
        const { profiles, currentProfileId } = get();
        const updatedProfiles = profiles.filter(p => p.id !== id);
        set({
          profiles: updatedProfiles,
          currentProfileId: currentProfileId === id ? null : currentProfileId,
        });
      },

      setCurrentProfile: async (id: string) => {
        const { profiles } = get();
        const selectedProfile = profiles.find(p => p.id === id);
        if (selectedProfile) {
          try {
            console.log('Selected profile:', selectedProfile);

            // 現在の拡張機能の状態を取得
            const currentExtensions = await new Promise<chrome.management.ExtensionInfo[]>(
              resolve => {
                chrome.management.getAll(extensions => resolve(extensions));
              }
            );
            console.log('Current extensions:', currentExtensions);

            // プロファイルに含まれる拡張機能の状態を更新
            const updatePromises = currentExtensions.map(ext => {
              const profileExtension = selectedProfile.extensions.find(e => e.id === ext.id);
              console.log(
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
                      console.log(
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
            console.log('All extension updates completed');
            set({ currentProfileId: id });
          } catch (error) {
            console.error('Failed to update extension states:', error);
            throw error;
          }
        } else {
          set({ currentProfileId: id });
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
    }
  )
);
