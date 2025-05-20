import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TagIcon } from '@heroicons/react/24/outline';
import { TagIcon as TagSolidIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';

import { Tag } from '../types/tag';

interface TagSelectionDialogProps {
  isOpen: boolean;
  tags: Tag[];
  selectedTagIds: string[];
  onClose: () => void;
  onSelectTags: (tagIds: string[]) => void;
}

export function TagSelectionDialog({
  isOpen,
  tags,
  selectedTagIds,
  onClose,
  onSelectTags,
}: TagSelectionDialogProps) {
  const handleTagClick = (tagId: string) => {
    const newSelectedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    onSelectTags(newSelectedTagIds);
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
          <div className="fixed inset-0 bg-black/90 dark:bg-black/90" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    Select Tags
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-300"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.id)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold transition-opacity ${
                        selectedTagIds.includes(tag.id)
                          ? 'bg-zinc-200 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100'
                          : 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                      } flex items-center gap-2`}
                    >
                      {selectedTagIds.includes(tag.id) ? (
                        <TagSolidIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      ) : (
                        <TagIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      )}
                      <span>{tag.name}</span>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
