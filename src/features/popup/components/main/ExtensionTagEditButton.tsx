import { PencilIcon } from 'lucide-react';

import { useState } from 'react';

import { TagEditorDialog } from '@/features/popup/components/editor';

/**
 * The ExtensionTagEditButton component.
 *
 * @returns The ExtensionTagEditButton component.
 */
export function ExtensionTagEditButton() {
  /**
   * The state for the dialog.
   */
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /**
   * The ExtensionTagEditButton component.
   *
   * @returns The ExtensionTagEditButton component.
   */
  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="px-3 py-1 text-2xs font-medium rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
      >
        <PencilIcon className="w-3 h-3 inline-flex mr-1" strokeWidth={1} />
        <span className="">Edit Tags</span>
      </button>

      <TagEditorDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
