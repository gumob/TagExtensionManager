import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { ExtensionModel } from '@/models';
import { useTagStore } from '@/stores';

/**
 * The context value type for TagSelectorContext.
 */
interface TagSelectorContextValue {
  /**
   * The search query.
   */
  searchQuery: string;
  /**
   * The set search query function.
   */
  setSearchQuery: (query: string) => void;
  /**
   * The filtered tags.
   */
  filteredTags: Array<{ id: string; name: string }>;
  /**
   * The current tag ids.
   */
  currentTagIds: string[];
  /**
   * The handle tag click function.
   */
  handleTagClick: (tagId: string) => void;
  /**
   * Whether the tag selector is open.
   */
  isOpen: boolean;
  /**
   * The set is open function.
   */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * The TagSelectorContext.
 */
const TagSelectorContext = createContext<TagSelectorContextValue | null>(null);

/**
 * The props for the TagSelectorProvider component.
 */
interface TagSelectorProviderProps {
  /**
   * The extension to select tags for.
   */
  extension: ExtensionModel;
  /**
   * The children to render.
   */
  children: React.ReactNode;
}

/**
 * The TagSelectorProvider component.
 *
 * @param extension - The extension to select tags for.
 * @param children - The children to render.
 * @returns The TagSelectorProvider component.
 */
export const TagSelectorProvider: React.FC<TagSelectorProviderProps> = ({
  extension,
  children,
}) => {
  const { tags, extensionTags, addTagToExtension, removeTagFromExtension } = useTagStore();

  /**
   * Current tag ids.
   */
  const currentTagIds = useMemo(
    () => extensionTags.find(extTag => extTag.extensionId === extension.id)?.tagIds ?? [],
    [extension.id, extensionTags]
  );

  /**
   * The search query.
   */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * The set is open function.
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * The filtered tags.
   */
  const filteredTags = useMemo(
    () => tags.filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [tags, searchQuery]
  );

  /**
   * The handle tag click.
   */
  const handleTagClick = useCallback(
    (tagId: string) => {
      /** The new current tag ids. */
      const newCurrentTagIds = currentTagIds.includes(tagId)
        ? currentTagIds.filter(id => id !== tagId)
        : [...currentTagIds, tagId];

      /** Add new tags */
      newCurrentTagIds.forEach(tagId => {
        if (!currentTagIds.includes(tagId)) {
          addTagToExtension(extension.id, tagId);
        }
      });

      /** Remove deselected tags */
      currentTagIds.forEach(tagId => {
        if (!newCurrentTagIds.includes(tagId)) {
          removeTagFromExtension(extension.id, tagId);
        }
      });
    },
    [currentTagIds, extension.id, addTagToExtension, removeTagFromExtension]
  );

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      filteredTags,
      currentTagIds,
      handleTagClick,
      isOpen,
      setIsOpen,
    }),
    [searchQuery, filteredTags, currentTagIds, handleTagClick, isOpen, setIsOpen]
  );

  return <TagSelectorContext.Provider value={value}>{children}</TagSelectorContext.Provider>;
};

/**
 * The useTagSelectorContext hook.
 *
 * @returns The TagSelectorContext value.
 * @throws Error if used outside of TagSelectorProvider.
 */
export const useTagSelectorContext = () => {
  const context = useContext(TagSelectorContext);
  if (!context) {
    throw new Error('useTagSelectorContext must be used within a TagSelectorProvider');
  }
  return context;
};
