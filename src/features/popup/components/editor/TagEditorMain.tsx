import { Dialog, Transition } from '@headlessui/react';

import { Fragment } from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { TagEditorProvider } from '@/contexts/TagEditorContext';
import {
  TagEditorHeader,
  TagEditorList,
  TagEditorSearchBar,
} from '@/features/popup/components/editor';

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
                  <TagEditorProvider>
                    <div className="flex flex-col max-h-[80vh]">
                      <div className="flex-none">
                        <TagEditorHeader onClose={onClose} />
                        <TagEditorSearchBar />
                      </div>
                      <TagEditorList />
                    </div>
                  </TagEditorProvider>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DndProvider>
  );
};
