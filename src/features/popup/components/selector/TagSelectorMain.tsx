import { Dialog, Transition } from '@headlessui/react';

import { Fragment, useState } from 'react';

import {
  TagSelectorHeader,
  TagSelectorList,
  TagSelectorSearchBar,
} from '@/features/popup/components/selector';
import { TagModel } from '@/models';

/**
 * The props for the TagSelectorMain component.
 */
interface TagSelectorMainProps {
  isOpen: boolean;
  tags: TagModel[];
  selectedTagIds: string[];
  onClose: () => void;
  onSelectTags: (tagIds: string[]) => void;
}

/**
 * The TagSelectorMain component.
 *
 * @param isOpen - Whether the tag selector is open.
 * @param tags - The tags to select from.
 * @param selectedTagIds - The selected tag ids.
 * @param onClose - The callback to close the tag selector.
 * @param onSelectTags - The callback to select the tags.
 * @returns The TagSelectorMain component.
 */
export const TagSelectorMain: React.FC<TagSelectorMainProps> = ({
  isOpen,
  tags,
  selectedTagIds,
  onClose,
  onSelectTags,
}) => {
  /**
   * The search query.
   */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * The filtered tags.
   */
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
   * The TagSelectorMain component.
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
                <TagSelectorHeader onClose={onClose} />
                <TagSelectorSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  isOpen={isOpen}
                />
                <TagSelectorList
                  tags={filteredTags}
                  selectedTagIds={selectedTagIds}
                  onTagClick={handleTagClick}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
