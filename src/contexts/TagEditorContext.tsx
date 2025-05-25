import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { TagModel } from '@/models';
import { useTagStore } from '@/stores';

/**
 * The context value type for TagEditorContext.
 */
interface TagEditorContextValue {
  /**
   * The sorted tags.
   */
  sortedTags: TagModel[];
  /**
   * The editing tag id.
   */
  editingTagId: string | null;
  /**
   * The set editing tag id function.
   */
  setEditingTagId: (tagId: string | null) => void;
  /**
   * The move tag function.
   */
  moveTag: (dragIndex: number, hoverIndex: number) => void;
  /**
   * The handle tag click function.
   */
  handleTagClick: (tagId: string) => void;
  /**
   * The handle tag name change function.
   */
  handleTagNameChange: (tagId: string, newName: string, shouldCloseEdit?: boolean) => void;
  /**
   * The handle delete click function.
   */
  handleDeleteClick: (tagId: string) => void;
  /**
   * The add tag function.
   */
  addTag: (name: string) => void;
}

/**
 * The TagEditorContext.
 */
const TagEditorContext = createContext<TagEditorContextValue | null>(null);

/**
 * The props for the TagEditorProvider component.
 */
interface TagEditorProviderProps {
  /**
   * The children to render.
   */
  children: React.ReactNode;
}

/**
 * The TagEditorProvider component.
 *
 * @param children - The children to render.
 * @returns The TagEditorProvider component.
 */
export const TagEditorProvider: React.FC<TagEditorProviderProps> = ({ children }) => {
  const { tags, addTag, updateTag, deleteTag, reorderTags } = useTagStore();
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  /**
   * The sorted tags.
   */
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => a.order - b.order);
  }, [tags]);

  /**
   * The move tag handler.
   */
  const moveTag = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const items = Array.from(sortedTags);
      const [draggedItem] = items.splice(dragIndex, 1);
      items.splice(hoverIndex, 0, draggedItem);
      reorderTags(items.map(item => item.id));
    },
    [sortedTags, reorderTags]
  );

  /**
   * The handle tag click handler.
   */
  const handleTagClick = useCallback((tagId: string) => {
    setEditingTagId(tagId);
  }, []);

  /**
   * The handle tag name change handler.
   */
  const handleTagNameChange = useCallback(
    (tagId: string, newName: string, shouldCloseEdit: boolean = false) => {
      updateTag(tagId, newName);
      if (shouldCloseEdit) {
        setEditingTagId(null);
      }
    },
    [updateTag]
  );

  /**
   * The handle delete click handler.
   */
  const handleDeleteClick = useCallback(
    (tagId: string) => {
      setEditingTagId(null);
      deleteTag(tagId);
    },
    [deleteTag]
  );

  const value = useMemo(
    () => ({
      sortedTags,
      editingTagId,
      setEditingTagId,
      moveTag,
      handleTagClick,
      handleTagNameChange,
      handleDeleteClick,
      addTag,
    }),
    [
      sortedTags,
      editingTagId,
      moveTag,
      handleTagClick,
      handleTagNameChange,
      handleDeleteClick,
      addTag,
    ]
  );

  return <TagEditorContext.Provider value={value}>{children}</TagEditorContext.Provider>;
};

/**
 * The useTagEditorContext hook.
 *
 * @returns The TagEditorContext value.
 * @throws Error if used outside of TagEditorProvider.
 */
export const useTagEditorContext = () => {
  const context = useContext(TagEditorContext);
  if (!context) {
    throw new Error('useTagEditorContext must be used within a TagEditorProvider');
  }
  return context;
};
