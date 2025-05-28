import React from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DialogHeader, DialogRoot } from '@/components';
import { TagEditorProvider } from '@/contexts';
import { TagEditorList, TagEditorSearchBar } from '@/features/popup/components/editor';

/**
 * The props for the TagEditorMain component.
 * @param isOpen - Whether the tag editor is open.
 * @param onClose - The callback to close the tag editor.
 */
interface TagEditorMainProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The TagEditorMain component.
 *
 * @param isOpen - Whether the tag editor is open.
 * @param onClose - The callback to close the tag editor.
 * @returns The TagEditorMain component.
 */
export const TagEditorMain: React.FC<TagEditorMainProps> = ({ isOpen, onClose }) => {
  return (
    <DialogRoot isOpen={isOpen} onClose={onClose}>
      <DndProvider backend={HTML5Backend}>
        <TagEditorProvider>
          <div className="flex flex-col gap-4">
            <DialogHeader title="Edit Tags" onClose={onClose} />
            <TagEditorSearchBar />
            <TagEditorList />
          </div>
        </TagEditorProvider>
      </DndProvider>
    </DialogRoot>
  );
};
