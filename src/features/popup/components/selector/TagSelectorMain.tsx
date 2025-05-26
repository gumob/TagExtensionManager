import { Dialog, Transition } from '@headlessui/react';

import { Fragment } from 'react';

import { TagSelectorProvider } from '@/contexts';
import {
  TagSelectorHeader,
  TagSelectorList,
  TagSelectorSearchBar,
} from '@/features/popup/components/selector';
import { ExtensionModel } from '@/models';

/**
 * The props for the TagSelectorMain component.
 */
interface TagSelectorMainProps {
  extension: ExtensionModel;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The TagSelectorMain component.
 *
 * @param extension - The extension to select tags for.
 * @param isOpen - Whether the tag selector is open.
 * @param onClose - The callback to close the tag selector.
 * @returns The TagSelectorMain component.
 */
export const TagSelectorMain: React.FC<TagSelectorMainProps> = ({ extension, isOpen, onClose }) => {
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
          <div className="fixed inset-0 bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-xl shadow-zinc-300 dark:shadow-zinc-900 transition-all">
                <TagSelectorProvider extension={extension}>
                  <div className="flex flex-col gap-4">
                    <TagSelectorHeader onClose={onClose} />
                    <TagSelectorSearchBar />
                    <TagSelectorList />
                  </div>
                </TagSelectorProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
