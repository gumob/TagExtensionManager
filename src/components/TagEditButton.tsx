import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { TagEditor } from './TagEditor';

export function TagEditButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="px-3 py-1 text-2xs font-medium rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
      >
        <PlusIcon className="w-4 h-4 inline-block" />
      </button>

      <TagEditor isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
