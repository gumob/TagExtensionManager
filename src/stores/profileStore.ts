import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Profile, ProfileState } from '../types/profile';

interface ProfileStore extends ProfileState {
  addProfile: (name: string, extensions: { id: string; enabled: boolean }[]) => void;
  updateProfile: (id: string, name: string) => void;
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

      updateProfile: (id, name) => {
        const { profiles } = get();
        const updatedProfiles = profiles.map(p =>
          p.id === id
            ? {
                ...p,
                name,
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

      setCurrentProfile: id => {
        set({ currentProfileId: id });
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
