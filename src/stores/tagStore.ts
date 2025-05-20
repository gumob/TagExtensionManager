import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ExtensionTag, Tag, TagState, TagStore } from '../types/tag';

export const useTagStore = create<TagStore>()(
  persist(
    (set, get) => ({
      tags: [],
      extensionTags: [],
      visibleTagId: null,

      /** Initialize store with tags from storage */
      initialize: async () => {
        try {
          const result = await chrome.storage.local.get('extension-manager-tags');
          const storedData = result['extension-manager-tags'];
          if (storedData) {
            console.debug('[SEM][TagStore] Loading tags from storage:', storedData);
            set({
              tags: storedData.tags,
              extensionTags: storedData.extensionTags,
              visibleTagId: null,
            });
          }
        } catch (error) {
          console.error('[SEM][TagStore] Failed to load tags:', error);
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedTags = tags.map(tag => ({
          ...tag,
          order: tag.order + 1,
          updatedAt: new Date().toISOString(),
        }));
        set({ tags: [newTag, ...updatedTags] });
      },

      /** Update a tag */
      updateTag: (id: string, name: string) => {
        const { tags } = get();
        const updatedTags = tags.map(tag =>
          tag.id === id
            ? {
                ...tag,
                name,
                updatedAt: new Date().toISOString(),
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
              updatedAt: new Date().toISOString(),
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
        getItem: async name => {
          const result = await chrome.storage.local.get(name);
          const data = result[name];
          console.debug('[SEM][TagStore] Loading from storage:', { name, data });
          return data;
        },
        setItem: async (name, value) => {
          console.debug('[SEM][TagStore] Saving to storage:', { name, value });
          await chrome.storage.local.set({ [name]: value });
        },
        removeItem: async name => {
          console.debug('[SEM][TagStore] Removing from storage:', name);
          await chrome.storage.local.remove(name);
        },
      },
      partialize: (state: TagStore) =>
        ({
          tags: state.tags,
          extensionTags: state.extensionTags,
        }) as TagState,
    }
  )
);
