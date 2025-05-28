import React from 'react';

import { DialogHeader, DialogRoot } from '@/components';
import { TagSelectorProvider } from '@/contexts';
import { TagSelectorList, TagSelectorSearchBar } from '@/features/popup/components/selector';
import { ExtensionModel } from '@/models';

/**
 * The props for the TagSelectorMain component.
 */
interface TagSelectorMainProps {
  extension: ExtensionModel;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The TagSelectorMain component.
 *
 * @param extension - The extension to select tags for.
 * @param isOpen - Whether the tag selector is open.
 * @param onClose - The callback to close the tag selector.
 * @returns The TagSelectorMain component.
 */
export const TagSelectorMain: React.FC<TagSelectorMainProps> = ({ extension, isOpen, onClose }) => {
  return (
    <DialogRoot isOpen={isOpen} onClose={onClose}>
      <TagSelectorProvider extension={extension}>
        <div className="flex flex-col gap-4">
          <DialogHeader title="Select Tags" onClose={onClose} />
          <TagSelectorSearchBar />
          <TagSelectorList />
        </div>
      </TagSelectorProvider>
    </DialogRoot>
  );
};
