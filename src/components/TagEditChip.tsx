import { PencilIcon } from 'lucide-react';

import { useState } from 'react';

import { TagEditor } from '@/components/TagEditor';

/**
 * The TagEditChip component.
 *
 * @returns The TagEditChip component.
 */
export function TagEditChip() {
  /**
   * The state for the dialog.
   */
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /**
   * The TagEditChip component.
   *
   * @returns The TagEditChip component.
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

      <TagEditor isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
