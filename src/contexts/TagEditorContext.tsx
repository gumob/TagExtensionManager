import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import toast from 'react-hot-toast';

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
   * The editing tag name.
   */
  editingTagName: string;
  /**
   * The set editing tag id function.
   */
  setEditingTagId: (tagId: string | null) => void;
  /**
   * The add tag function.
   */
  addTag: (name: string) => void;
  /**
   * The move tag function.
   */
  moveTag: (dragIndex: number, hoverIndex: number) => void;
  /**
   * The delete tag function.
   */
  deleteTag: (tagId: string) => void;
  /**
   * The change tag name function.
   */
  changeTagName: (tagId: string, newName: string, shouldCloseEdit?: boolean) => void;
  /**
   * The start editing function.
   */
  startEditing: (tagId: string, initialName: string) => void;
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
  const { tags, addTag: addTagToStore, updateTag, deleteTag: deleteTagOnStore, reorderTags } = useTagStore();

  /**
   * The max tag name length.
   */
  const maxTagNameLength = 24;
  /**
   * The editing tag id.
   */
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  /**
   * The editing tag name.
   */
  const [editingTagName, setEditingTagName] = useState<string>('');

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
   * Check if a tag name already exists
   * @param name - The tag name to check
   * @param excludeTagId - The tag ID to exclude from the check (for editing)
   * @returns Whether the tag name already exists
   */
  const isDuplicateTagName = useCallback(
    (name: string, excludeTagId?: string) => {
      return tags.some(tag => tag.name === name && tag.id !== excludeTagId);
    },
    [tags]
  );

  /**
   * The add tag handler.
   */
  const addTag = useCallback(
    (name: string) => {
      if (!name.trim()) {
        toast.error('Empty tag names are not allowed.');
        return;
      }
      if (name.length > maxTagNameLength) {
        toast.error(`Tag name must be ${maxTagNameLength} characters or less.`);
        return;
      }
      if (isDuplicateTagName(name)) {
        toast.error(`Tag '${name}' already exists.`);
        return;
      }
      addTagToStore(name);
    },
    [addTagToStore, isDuplicateTagName]
  );

  /**
   * Start editing a tag
   */
  const startEditing = useCallback((tagId: string, initialName: string) => {
    setEditingTagId(tagId);
    setEditingTagName(initialName);
  }, []);

  /**
   * The handle tag name change handler.
   */
  const changeTagName = useCallback(
    (tagId: string, newName: string, shouldCloseEdit: boolean = false) => {
      if (shouldCloseEdit) {
        if (!newName.trim()) {
          toast.error('Empty tag names are not allowed.');
          // Reset to original name
          const originalTag = tags.find(tag => tag.id === tagId);
          if (originalTag) {
            updateTag(tagId, originalTag.name);
          }
          setEditingTagId(null);
          return;
        }
        if (newName.length > maxTagNameLength) {
          toast.error(`Tag name must be ${maxTagNameLength} characters or less.`);
          // Reset to original name
          const originalTag = tags.find(tag => tag.id === tagId);
          if (originalTag) {
            updateTag(tagId, originalTag.name);
          }
          setEditingTagId(null);
          return;
        }
        if (isDuplicateTagName(newName, tagId)) {
          toast.error(`Tag '${newName}' already exists.`);
          // Reset to original name
          const originalTag = tags.find(tag => tag.id === tagId);
          if (originalTag) {
            updateTag(tagId, originalTag.name);
          }
          setEditingTagId(null);
          return;
        }
        updateTag(tagId, newName);
        setEditingTagId(null);
      } else {
        setEditingTagName(newName);
      }
    },
    [updateTag, isDuplicateTagName, tags]
  );

  /**
   * The handle delete click handler.
   */
  const deleteTag = useCallback(
    (tagId: string) => {
      setEditingTagId(null);
      deleteTagOnStore(tagId);
    },
    [deleteTagOnStore]
  );

  const value = useMemo(
    () => ({
      sortedTags,
      editingTagId,
      editingTagName,
      setEditingTagId,
      moveTag,
      changeTagName,
      deleteTag,
      addTag,
      startEditing,
    }),
    [sortedTags, editingTagId, editingTagName, moveTag, changeTagName, deleteTag, addTag, startEditing]
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
