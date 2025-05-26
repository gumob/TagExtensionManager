import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * The props for the TagEditorHeader component.
 */
interface TagEditorHeaderProps {
  /**
   * The callback to close the tag editor.
   */
  onClose: () => void;
}

/**
 * The TagEditorHeader component.
 *
 * @param onClose - The callback to close the tag editor.
 * @returns The TagEditorHeader component.
 */
export const TagEditorHeader: React.FC<TagEditorHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Edit Tags</h2>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus:outline-none"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};
