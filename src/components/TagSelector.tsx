import { Tag } from '@/types/tag';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TagIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TagIcon as TagSolidIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useRef, useState } from 'react';

/**
 * The props for the TagSelector component.
 */
interface TagSelectorProps {
  isOpen: boolean;
  tags: Tag[];
  selectedTagIds: string[];
  onClose: () => void;
  onSelectTags: (tagIds: string[]) => void;
}

/**
 * The TagSelector component.
 *
 * @param isOpen - Whether the tag selector is open.
 * @param tags - The tags to select from.
 * @param selectedTagIds - The selected tag ids.
 * @param onClose - The callback to close the tag selector.
 * @param onSelectTags - The callback to select the tags.
 * @returns The TagSelector component.
 */
export function TagSelector({
  isOpen,
  tags,
  selectedTagIds,
  onClose,
  onSelectTags,
}: TagSelectorProps) {
  /**
   * The search query.
   */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * The search input ref.
   */
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * The use effect for the tag selector.
   */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  /**
   * The handle tag click.
   */
  const handleTagClick = (tagId: string) => {
    const newSelectedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    onSelectTags(newSelectedTagIds);
  };

  /**
   * The filtered tags.
   */
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * The TagSelector component.
   */
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

                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search tags..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.id)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold transition-opacity ${
                        selectedTagIds.includes(tag.id)
                          ? 'bg-zinc-200 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100'
                          : 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                      } flex items-center gap-1`}
                    >
                      {selectedTagIds.includes(tag.id) ? (
                        <TagSolidIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      ) : (
                        <TagIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      )}
                      <span className="mr-2">{tag.name}</span>
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
