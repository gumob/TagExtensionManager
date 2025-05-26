import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * The props for the TagSelectorHeader component.
 */
interface TagSelectorHeaderProps {
  onClose: () => void;
}

/**
 * The TagSelectorHeader component.
 *
 * @param onClose - The callback to close the tag selector.
 * @returns The TagSelectorHeader component.
 */
export const TagSelectorHeader: React.FC<TagSelectorHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-header">Select Tags</h2>
      <button onClick={onClose} className="dialog-close-button">
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};
