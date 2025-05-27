import { TagIcon } from '@heroicons/react/24/outline';

import { useEffect, useRef, useState } from 'react';

import { SearchBarComponent } from '@/components';
import { useTagEditorContext } from '@/contexts';

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
    if (!searchInputRef.current) return;
    searchInputRef.current?.focus();
  }, [searchInputRef]);

  return (
    <SearchBarComponent
      inputRef={searchInputRef}
      value={newTagName}
      placeholder="Enter new tag name..."
      onInputChange={e => setNewTagName(e.target.value)}
      onInputKeyDown={handleKeyDown}
      icon={<TagIcon className="h-5 w-5 icon-color-default" aria-hidden="true" />}
      buttons={
        <button onClick={handleAddTag} className="px-4 py-1.5 button-search-bar">
          Add
        </button>
      }
    />
  );
};
