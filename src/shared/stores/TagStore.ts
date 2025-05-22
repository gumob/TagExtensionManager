import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ExtensionTag, Tag, TagState, TagStore } from '@/shared/types';
import { logger } from '@/shared/utils';

/**
 * Cache for storing loaded data.
 */
let dataCache: TagState | null = null;

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

          /** Use cached data if available */
          if (dataCache) {
            set({
              tags: dataCache.tags,
              extensionTags: dataCache.extensionTags,
              visibleTagId: null,
              isLoading: false,
            });
            return;
          }

          const storedData = await chrome.storage.local.get('extension-manager-tags');
          if (storedData['extension-manager-tags']) {
            logger.debug('Loading tags from storage', {
              group: 'TagStore',
              persist: true,
            });

            /** Cache the loaded data */
            dataCache = {
              tags: storedData['extension-manager-tags'].tags.map((tag: any) => ({
                ...tag,
                createdAt: new Date(tag.createdAt),
                updatedAt: new Date(tag.updatedAt),
              })),
              extensionTags: storedData['extension-manager-tags'].extensionTags,
              visibleTagId: null,
            };

            if (dataCache) {
              set({
                tags: dataCache.tags,
                extensionTags: dataCache.extensionTags,
                visibleTagId: null,
                isLoading: false,
              });
            }
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

        /** Update cache */
        if (dataCache) {
          dataCache.tags = newTags;
        }
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
        if (existingExtensionTag) {
          if (!existingExtensionTag.tagIds.includes(tagId)) {
            const updatedExtensionTags = extensionTags.map(extTag =>
              extTag.extensionId === extensionId
                ? { ...extTag, tagIds: [...extTag.tagIds, tagId] }
                : extTag
            );
            set({ extensionTags: updatedExtensionTags });
          }
        } else {
          set({ extensionTags: [...extensionTags, { extensionId, tagIds: [tagId] }] });
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
            /** Use cached data if available */
            if (dataCache) {
              return dataCache;
            }
            const result = await chrome.storage.local.get(name);
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
            await chrome.storage.local.set({ [name]: value });
            /** Update cache */
            dataCache = value;
          } catch (error) {
            logger.error('Failed to set item in storage', {
              group: 'TagStore',
              persist: true,
            });
          }
        },
        removeItem: async (name: string) => {
          try {
            await chrome.storage.local.remove(name);
            /** Clear cache */
            dataCache = null;
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
