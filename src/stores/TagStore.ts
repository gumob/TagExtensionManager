import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { chromeAPI } from '@/api/ChromeAPI';
import { TagExtensionMapModel, TagModel, TagManagementModel } from '@/models';
import { logger } from '@/utils';

/**
 * The tag store type.
 *
 * @property addTag - The add tag function.
 * @property updateTag - The update tag function.
 * @property deleteTag - The delete tag function.
 * @property reorderTags - The reorder tags function.
 * @property addTagToExtension - The add tag to extension function.
 * @property removeTagFromExtension - The remove tag from extension function.
 */
export interface TagStore extends TagManagementModel {
  addTag: (name: string) => void;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  reorderTags: (tagIds: string[]) => void;
  addTagToExtension: (extensionId: string, tagId: string) => void;
  removeTagFromExtension: (extensionId: string, tagId: string) => void;
  importTags: (tags: TagModel[], extensionTags: TagExtensionMapModel[]) => void;
  exportTags: () => { tags: TagModel[]; extensionTags: TagExtensionMapModel[] };
  initialize: () => Promise<void>;
  setVisibleTag: (tagId: string | null) => void;
  showAllTags: () => void;
  isLoading: boolean;
}

/**
 * The tag store.
 * This store manages all tag-related state and operations including:
 * - Managing tags and their associations with extensions
 * - Persisting tag data to Chrome storage
 * - Handling tag visibility and filtering
 */
export const useTagStore = create<TagStore>()(
  persist(
    (set, get) => ({
      tags: [],
      extensionTags: [],
      visibleTagId: null,
      isLoading: false,

      /**
       * Initializes the tag store by loading saved data from Chrome storage
       * 
       * This function:
       * 1. Sets loading state to true
       * 2. Attempts to load saved tag data from Chrome storage
       * 3. If data exists, converts date strings back to Date objects
       * 4. If no data exists, initializes with empty arrays
       * 5. Updates the store state with loaded or empty data
       * 6. Sets loading state back to false
       */
      initialize: async () => {
        try {
          set({ isLoading: true });

          const storedData = await chromeAPI.getLocalStorage('extension-manager-tags');
          if (storedData['extension-manager-tags']) {
            logger.debug('Loading tags from storage', {
              group: 'TagStore',
              persist: true,
            });

            const loadedData = {
              tags: storedData['extension-manager-tags'].tags.map((tag: any) => ({
                ...tag,
                createdAt: new Date(tag.createdAt),
                updatedAt: new Date(tag.updatedAt),
              })),
              extensionTags: storedData['extension-manager-tags'].extensionTags,
              visibleTagId: null,
            };

            set({
              tags: loadedData.tags,
              extensionTags: loadedData.extensionTags,
              visibleTagId: null,
              isLoading: false,
            });
          } else {
            /** Initialize with empty data if no stored data exists */
            set({
              tags: [],
              extensionTags: [],
              visibleTagId: null,
              isLoading: false,
            });
          }
        } catch (error) {
          logger.error('Failed to load tags', {
            group: 'TagStore',
            persist: true,
          });
          set({ isLoading: false });
        }
      },

      /**
       * Sets which tag's extensions should be visible in the UI
       * When a tag ID is provided, only extensions with that tag will be shown
       * When null is provided, this filter is cleared
       */
      setVisibleTag: (tagId: string | null) => {
        set({ visibleTagId: tagId });
      },

      /**
       * Clears the tag visibility filter by setting visibleTagId to null
       * This causes all extensions to be shown regardless of their tags
       */
      showAllTags: () => {
        set({ visibleTagId: null });
      },

      /**
       * Creates a new tag and adds it to the beginning of the tags list
       * 
       * This function:
       * 1. Creates a new tag object with a unique ID and the current timestamp
       * 2. Increments the order of all existing tags by 1
       * 3. Places the new tag at the start of the list
       * 4. Updates the store state
       * 5. Saves the updated tag list to Chrome storage
       */
      addTag: (name: string) => {
        const { tags } = get();
        const newTag: TagModel = {
          id: uuidv4(),
          name,
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const updatedTags = tags.map(tag => ({
          ...tag,
          order: tag.order + 1,
          updatedAt: new Date(),
        }));
        const newTags = [newTag, ...updatedTags];
        set({ tags: newTags });

        /** Save to storage immediately */
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: newTags,
            extensionTags: get().extensionTags,
          },
        });
      },

      /**
       * Updates an existing tag's name
       * 
       * This function:
       * 1. Finds the tag with the matching ID
       * 2. Updates its name and updatedAt timestamp
       * 3. Updates the store state
       * 4. Saves the changes to Chrome storage
       */
      updateTag: (id: string, name: string) => {
        const { tags } = get();
        const updatedTags = tags.map(tag =>
          tag.id === id
            ? {
                ...tag,
                name,
                updatedAt: new Date(),
              }
            : tag
        );
        set({ tags: updatedTags });

        /** Save to storage immediately */
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: updatedTags,
            extensionTags: get().extensionTags,
          },
        });
      },

      /**
       * Deletes a tag and removes all its associations with extensions
       * 
       * This function:
       * 1. Removes the tag from the tags list
       * 2. Removes the tag ID from all extension tag associations
       * 3. Updates the store state
       * 4. Saves the changes to Chrome storage
       */
      deleteTag: (id: string) => {
        const { tags, extensionTags } = get();
        const updatedTags = tags.filter(tag => tag.id !== id);
        const updatedExtensionTags = extensionTags.map(extTag => ({
          ...extTag,
          tagIds: extTag.tagIds.filter(tagId => tagId !== id),
        }));
        set({ tags: updatedTags, extensionTags: updatedExtensionTags });

        /** Save to storage immediately */
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: updatedTags,
            extensionTags: updatedExtensionTags,
          },
        });
      },

      /**
       * Reorders tags based on a new order of tag IDs
       * 
       * This function:
       * 1. Takes an array of tag IDs in their new desired order
       * 2. Updates each tag's order property to match its new position
       * 3. Updates their updatedAt timestamps
       * 4. Updates the store state with the reordered tags
       */
      reorderTags: (tagIds: string[]) => {
        const { tags } = get();
        const updatedTags = tagIds
          .map((id, index) => {
            const tag = tags.find(t => t.id === id);
            if (!tag) return null;
            return {
              ...tag,
              order: index,
              updatedAt: new Date(),
            };
          })
          .filter((tag): tag is TagModel => tag !== null);
        set({ tags: updatedTags });
      },

      /**
       * Associates a tag with an extension
       * 
       * This function:
       * 1. Checks if the extension already has any tags
       * 2. If it does, adds the new tag ID to its existing tags
       * 3. If it doesn't, creates a new extension-tag association
       * 4. Updates the store state
       * 5. Saves the changes to Chrome storage
       */
      addTagToExtension: (extensionId: string, tagId: string) => {
        const { extensionTags } = get();
        const existingExtensionTag = extensionTags.find(
          extTag => extTag.extensionId === extensionId
        );
        let updatedExtensionTags;
        if (existingExtensionTag) {
          if (!existingExtensionTag.tagIds.includes(tagId)) {
            updatedExtensionTags = extensionTags.map(extTag =>
              extTag.extensionId === extensionId
                ? { ...extTag, tagIds: [...extTag.tagIds, tagId] }
                : extTag
            );
            set({ extensionTags: updatedExtensionTags });
          }
        } else {
          updatedExtensionTags = [...extensionTags, { extensionId, tagIds: [tagId] }];
          set({ extensionTags: updatedExtensionTags });
        }

        /** Save to storage immediately */
        if (updatedExtensionTags) {
          chromeAPI.setLocalStorage({
            'extension-manager-tags': {
              tags: get().tags,
              extensionTags: updatedExtensionTags,
            },
          });
        }
      },

      /**
       * Removes a tag association from an extension
       * 
       * This function:
       * 1. Finds the extension's tag associations
       * 2. Removes the specified tag ID from its list of tags
       * 3. Updates the store state
       * 4. Saves the changes to Chrome storage
       */
      removeTagFromExtension: (extensionId: string, tagId: string) => {
        const { extensionTags } = get();
        const updatedExtensionTags = extensionTags.map(extTag =>
          extTag.extensionId === extensionId
            ? { ...extTag, tagIds: extTag.tagIds.filter(id => id !== tagId) }
            : extTag
        );
        set({ extensionTags: updatedExtensionTags });

        /** Save to storage immediately */
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: get().tags,
            extensionTags: updatedExtensionTags,
          },
        });
      },

      /**
       * Imports tags and their extension associations from external data
       * This completely replaces the current tags and associations
       */
      importTags: (tags: TagModel[], extensionTags: TagExtensionMapModel[]) => {
        set({ tags, extensionTags });
      },

      /**
       * Exports all tags and their extension associations
       * Returns the current state of tags and extension tag associations
       */
      exportTags: () => {
        const { tags, extensionTags } = get();
        return { tags, extensionTags };
      },
    }),
    {
      name: 'extension-manager-tags',
      storage: {
        /**
         * Custom storage getter that loads data from Chrome storage
         * Handles errors and logs them appropriately
         */
        getItem: async (name: string) => {
          try {
            const result = await chromeAPI.getLocalStorage(name);
            return result[name];
          } catch (error) {
            logger.error('Failed to get item from storage', {
              group: 'TagStore',
              persist: true,
            });
            return null;
          }
        },
        /**
         * Custom storage setter that saves data to Chrome storage
         * Handles errors and logs them appropriately
         */
        setItem: async (name: string, value: any) => {
          try {
            await chromeAPI.setLocalStorage({ [name]: value });
            logger.debug('Saved tags to storage', {
              group: 'TagStore',
              persist: true,
            });
          } catch (error) {
            logger.error('Failed to set item in storage', {
              group: 'TagStore',
              persist: true,
            });
          }
        },
        /**
         * Custom storage remover that deletes data from Chrome storage
         * Handles errors and logs them appropriately
         */
        removeItem: async (name: string) => {
          try {
            await chromeAPI.removeLocalStorage(name);
            logger.debug('Removed tags from storage', {
              group: 'TagStore',
              persist: true,
            });
          } catch (error) {
            logger.error('Failed to remove item from storage', {
              group: 'TagStore',
              persist: true,
            });
          }
        },
      },
    }
  )
);
