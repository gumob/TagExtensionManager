import { Dialog, Transition } from '@headlessui/react';

import { Fragment, useCallback, useMemo, useState } from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  TagEditorHeader,
  TagEditorList,
  TagEditorSearchBar,
} from '@/features/popup/components/editor';
import { useTagStore } from '@/stores';

/**
 * The props for the TagEditorMain component.
 * @param isOpen - Whether the tag editor is open.
 * @param onClose - The callback to close the tag editor.
 */
interface TagEditorMainProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The TagEditorMain component.
 *
 * @param isOpen - Whether the tag editor is open.
 * @param onClose - The callback to close the tag editor.
 * @returns The TagEditorMain component.
 */
export const TagEditorMain: React.FC<TagEditorMainProps> = ({ isOpen, onClose }) => {
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

  /**
   * The TagEditorMain component.
   */
  return (
    <DndProvider backend={HTML5Backend}>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 dark:bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 shadow-xl transition-all">
                  <div className="flex flex-col max-h-[80vh]">
                    <div className="flex-none">
                      <TagEditorHeader onClose={onClose} />
                      <TagEditorSearchBar />
                    </div>
                    <TagEditorList
                      tags={sortedTags}
                      moveTag={moveTag}
                      editingTagId={editingTagId}
                      onEdit={handleTagNameChange}
                      onDelete={handleDeleteClick}
                      onTagClick={handleTagClick}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DndProvider>
  );
};
