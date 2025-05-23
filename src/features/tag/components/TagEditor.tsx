import { Dialog, Transition } from '@headlessui/react';
import { TagIcon, XMarkIcon } from '@heroicons/react/24/outline';

import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FixedSizeList } from 'react-window';

import { TagEditorItem } from '@/features/tag/components';
import { TagModel } from '@/models';
import { useTagStore } from '@/stores';

/**
 * The props for the TagEditor component.
 * @param isOpen - Whether the tag editor is open.
 * @param onClose - The callback to close the tag editor.
 */
interface TagEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The TagEditor component.
 *
 * @param isOpen - Whether the tag editor is open.
 * @param onClose - The callback to close the tag editor.
 * @returns The TagEditor component.
 */
export const TagEditor = ({ isOpen, onClose }: TagEditorProps) => {
  const { tags, addTag, updateTag, deleteTag, reorderTags } = useTagStore();
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const tagListRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<FixedSizeList>(null);

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
   * The handle add tag handler.
   */
  const handleAddTag = useCallback(() => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
    }
  }, [newTagName, addTag]);

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
   * The TagEditor component.
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
                      <div className="flex justify-between items-center p-4">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                        >
                          Manage Tags
                        </Dialog.Title>
                        <button
                          onClick={onClose}
                          className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-300"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="px-4 pt-0 pb-4">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <TagIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              value={newTagName}
                              onChange={e => setNewTagName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              placeholder="Enter new tag name"
                              className="w-full h-10 pl-10 pr-3 py-1.5 rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
                            />
                          </div>
                          <button
                            onClick={handleAddTag}
                            className="px-4 py-1.5 bg-zinc-600 dark:bg-zinc-500 text-white rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-400"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-0 pb-4">
                      <div ref={tagListRef} className="flex flex-wrap gap-2">
                        {sortedTags.map((tag, index) => (
                          <TagEditorItem
                            key={tag.id}
                            tag={tag}
                            index={index}
                            moveTag={moveTag}
                            isEditing={editingTagId === tag.id}
                            onEdit={handleTagNameChange}
                            onDelete={handleDeleteClick}
                            onTagClick={handleTagClick}
                          />
                        ))}
                      </div>
                    </div>
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
