import { TagIcon } from '@heroicons/react/24/outline';

import { useEffect, useRef, useState } from 'react';

import { useTagEditorContext } from '@/contexts/TagEditorContext';

/**
 * The TagEditorSearchBar component.
 *
 * @returns The TagEditorSearchBar component.
 */
export const TagEditorSearchBar: React.FC = () => {
  const { addTag } = useTagEditorContext();
  const [newTagName, setNewTagName] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <TagIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter new tag name..."
            className="w-full h-10 pl-10 pr-3 py-1.5 rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500"
          />
        </div>
        <button
          onClick={handleAddTag}
          className="px-4 py-1.5 bg-zinc-600 dark:bg-zinc-500 text-white rounded-full hover:bg-zinc-600 dark:hover:bg-zinc-400"
        >
          Add
        </button>
      </div>
    </div>
  );
};
