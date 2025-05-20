import { FolderEditor } from '@/components/FolderEditor';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export const FolderEditButton = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <>
      <button
        className="p-1 rounded-full text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-200 bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        onClick={() => setIsEditorOpen(true)}
      >
        <PencilIcon className="w-3 h-3" />
      </button>
      {isEditorOpen && <FolderEditor onClose={() => setIsEditorOpen(false)} />}
    </>
  );
};
