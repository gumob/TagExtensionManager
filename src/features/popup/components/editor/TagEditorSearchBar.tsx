import { TagIcon } from '@heroicons/react/24/outline';

import React, { useEffect, useRef, useState } from 'react';

import { AddButtonComponent, SearchBarComponent } from '@/components';
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
      icon={<TagIcon className="h-5 w-5" aria-hidden="true" />}
      buttons={<AddButtonComponent onClick={handleAddTag} />}
    />
  );
};
