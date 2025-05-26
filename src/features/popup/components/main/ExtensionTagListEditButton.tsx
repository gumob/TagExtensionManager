import { PencilIcon } from 'lucide-react';

import { useState } from 'react';

import { TagEditorMain } from '@/features/popup/components/editor';

/**
 * The ExtensionTagListEditButton component.
 *
 * @returns The ExtensionTagListEditButton component.
 */
export const ExtensionTagListEditButton: React.FC = () => {
  const [isTagEditorOpen, setIsTagEditorOpen] = useState(false);

  /**
   * The ExtensionTagListEditButton component.
   *
   * @returns The ExtensionTagListEditButton component.
   */
  return (
    <>
      <button
        onClick={() => setIsTagEditorOpen(true)}
        className="px-3 py-1 text-2xs font-medium rounded-full text-default bg-chip-default"
      >
        <PencilIcon className="w-3 h-3 inline-flex mr-1 icon-color-default" strokeWidth={1} />
        <span className="">Edit Tags</span>
      </button>
      {isTagEditorOpen && (
        <TagEditorMain isOpen={isTagEditorOpen} onClose={() => setIsTagEditorOpen(false)} />
      )}
    </>
  );
};
