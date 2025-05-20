import { FolderEditor } from '@/components/FolderEditor';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export const FolderEditButton = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <>
      <button
        className="px-2 py-1 rounded-full text-2xs font-semibold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 flex items-center gap-1"
        onClick={() => setIsEditorOpen(true)}
      >
        {/* <span>Manage Folders</span> */}
        <PlusIcon className="w-3 h-3" />
      </button>
      {isEditorOpen && <FolderEditor onClose={() => setIsEditorOpen(false)} />}
    </>
  );
};
