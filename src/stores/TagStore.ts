import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { chromeAPI } from '@/api/ChromeAPI';
import { ExtensionTag, Tag, TagState } from '@/models';
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
export interface TagStore extends TagState {
  addTag: (name: string) => void;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  reorderTags: (tagIds: string[]) => void;
  addTagToExtension: (extensionId: string, tagId: string) => void;
  removeTagFromExtension: (extensionId: string, tagId: string) => void;
  importTags: (tags: Tag[], extensionTags: ExtensionTag[]) => void;
  exportTags: () => { tags: Tag[]; extensionTags: ExtensionTag[] };
  initialize: () => Promise<void>;
  setVisibleTag: (tagId: string | null) => void;
  showAllTags: () => void;
  isLoading: boolean;
}

/**
 * The tag store.
 *
 * @returns The tag store.
 */
export const useTagStore = create<TagStore>()(
  persist(
    (set, get) => ({
      tags: [],
      extensionTags: [],
      visibleTagId: null,
      isLoading: false,

      /** Initialize store with tags from storage */
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
            // Initialize with empty data if no stored data exists
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

      /** Set visible tag */
      setVisibleTag: (tagId: string | null) => {
        set({ visibleTagId: tagId });
      },

      /** Show all tags */
      showAllTags: () => {
        set({ visibleTagId: null });
      },

      /** Add a tag */
      addTag: (name: string) => {
        const { tags } = get();
        const newTag: Tag = {
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

        // Save to storage immediately
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: newTags,
            extensionTags: get().extensionTags,
          },
        });
      },

      /** Update a tag */
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

        // Save to storage immediately
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: updatedTags,
            extensionTags: get().extensionTags,
          },
        });
      },

      /** Delete a tag */
      deleteTag: (id: string) => {
        const { tags, extensionTags } = get();
        const updatedTags = tags.filter(tag => tag.id !== id);
        const updatedExtensionTags = extensionTags.map(extTag => ({
          ...extTag,
          tagIds: extTag.tagIds.filter(tagId => tagId !== id),
        }));
        set({ tags: updatedTags, extensionTags: updatedExtensionTags });

        // Save to storage immediately
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: updatedTags,
            extensionTags: updatedExtensionTags,
          },
        });
      },

      /** Reorder tags */
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
          .filter((tag): tag is Tag => tag !== null);
        set({ tags: updatedTags });
      },

      /** Add tag to extension */
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

        // Save to storage immediately
        if (updatedExtensionTags) {
          chromeAPI.setLocalStorage({
            'extension-manager-tags': {
              tags: get().tags,
              extensionTags: updatedExtensionTags,
            },
          });
        }
      },

      /** Remove tag from extension */
      removeTagFromExtension: (extensionId: string, tagId: string) => {
        const { extensionTags } = get();
        const updatedExtensionTags = extensionTags.map(extTag =>
          extTag.extensionId === extensionId
            ? { ...extTag, tagIds: extTag.tagIds.filter(id => id !== tagId) }
            : extTag
        );
        set({ extensionTags: updatedExtensionTags });

        // Save to storage immediately
        chromeAPI.setLocalStorage({
          'extension-manager-tags': {
            tags: get().tags,
            extensionTags: updatedExtensionTags,
          },
        });
      },

      /** Import tags and extension tags */
      importTags: (tags: Tag[], extensionTags: ExtensionTag[]) => {
        set({ tags, extensionTags });
      },

      /** Export tags and extension tags */
      exportTags: () => {
        const { tags, extensionTags } = get();
        return { tags, extensionTags };
      },
    }),
    {
      name: 'extension-manager-tags',
      storage: {
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
