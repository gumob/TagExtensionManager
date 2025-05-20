import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { useFolderStore } from '../stores/folderStore';
import { Folder } from '../types/folder';

interface FolderEditorProps {
  onClose: () => void;
}

export const FolderEditor = ({ onClose }: FolderEditorProps) => {
  const { folders, addFolder, updateFolder, deleteFolder, reorderFolders } = useFolderStore();
  const [newFolderName, setNewFolderName] = useState('');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(folders);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderFolders(items.map(item => item.id));
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-zinc-100 dark:bg-zinc-800">
      <div className="h-full w-full flex flex-col">
        <div className="flex justify-between items-center p-4 mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Manage Folders</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="folders">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {folders.map((folder, index) => (
                    <Draggable key={folder.id} draggableId={folder.id} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white dark:bg-zinc-700 rounded-xl p-3 mb-2 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <svg
                                className="w-5 h-5 text-zinc-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 8h16M4 16h16"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={folder.name}
                                onChange={e => updateFolder(folder.id, e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
                              />
                            </div>
                            <button
                              onClick={() => deleteFolder(folder.id)}
                              className="text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
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

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
          />
          <button
            onClick={handleAddFolder}
            className="px-4 py-1.5 bg-zinc-600 dark:bg-zinc-500 text-white rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-400"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
