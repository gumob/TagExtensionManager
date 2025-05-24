import { TagIcon } from '@heroicons/react/24/outline';

import { useCallback, useState } from 'react';

interface TagEditorSearchBarProps {
  onAddTag: (tagName: string) => void;
}

export const TagEditorSearchBar: React.FC<TagEditorSearchBarProps> = ({ onAddTag }) => {
  const [newTagName, setNewTagName] = useState('');

  const handleAddTag = useCallback(() => {
    if (newTagName.trim()) {
      onAddTag(newTagName.trim());
      setNewTagName('');
    }
  }, [newTagName, onAddTag]);

  return (
    <div className="px-4 pt-0 pb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <TagIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Enter new tag name"
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
