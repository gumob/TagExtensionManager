import { useTagStore } from '@/stores/tagStore';
import { Dialog, Transition } from '@headlessui/react';
import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import { EllipsisVerticalIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';

interface TagEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagEditor = ({ isOpen, onClose }: TagEditorProps) => {
  const { tags, addTag, updateTag, deleteTag, reorderTags } = useTagStore();
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tags);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderTags(items.map(item => item.id));
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
    }
  };

  const handleTagClick = (tagId: string) => {
    setEditingTagId(tagId);
  };

  const handleTagNameChange = (tagId: string, newName: string) => {
    updateTag(tagId, newName);
  };

  const handleTagNameBlur = () => {
    setEditingTagId(null);
  };

  const handleDragStart = () => {
    setEditingTagId(null);
  };

  const handleDeleteClick = (tagId: string) => {
    setEditingTagId(null);
    deleteTag(tagId);
  };

  return (
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
                  {/* Fixed header */}
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

                    {/* Add tag form */}
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

                  {/* Scrollable tag list */}
                  <div className="flex-1 overflow-y-auto px-4 pt-0 pb-4">
                    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                      <Droppable droppableId="tags">
                        {provided => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-col gap-2"
                          >
                            {tags
                              .sort((a, b) => a.order - b.order)
                              .map((tag, index) => (
                                <Draggable key={tag.id} draggableId={tag.id} index={index}>
                                  {provided => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="relative group"
                                      style={{
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="cursor-grab"
                                          >
                                            <TagIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                          </div>
                                          <div>
                                            {editingTagId === tag.id ? (
                                              <input
                                                type="text"
                                                value={tag.name}
                                                onChange={e =>
                                                  handleTagNameChange(tag.id, e.target.value)
                                                }
                                                onBlur={handleTagNameBlur}
                                                size={Math.max(tag.name.length, 1)}
                                                autoFocus
                                                className="px-1 py-0.5 rounded-sm bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-zinc-100 dark:focus:bg-zinc-600 focus:outline-none"
                                              />
                                            ) : (
                                              <button
                                                onClick={() => handleTagClick(tag.id)}
                                                className="px-1 py-0.5 text-zinc-900 dark:text-zinc-100"
                                              >
                                                {tag.name}
                                              </button>
                                            )}
                                          </div>
                                          <button
                                            onClick={() => handleDeleteClick(tag.id)}
                                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
                                          >
                                            <XMarkIcon className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
