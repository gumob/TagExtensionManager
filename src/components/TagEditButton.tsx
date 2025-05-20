import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { TagEditor } from './TagEditor';

export function TagEditButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="px-3 py-1 text-2xs font-medium bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors"
      >
        <PlusIcon className="w-4 h-4 inline-block" />
      </button>

      <TagEditor isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
