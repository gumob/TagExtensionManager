import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagEditorHeaderProps {
  onClose: () => void;
}

export const TagEditorHeader = ({ onClose }: TagEditorHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4">
      <Dialog.Title as="h3" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Manage Tags
      </Dialog.Title>
      <button
        onClick={onClose}
        className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-300"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
    </div>
  );
};
