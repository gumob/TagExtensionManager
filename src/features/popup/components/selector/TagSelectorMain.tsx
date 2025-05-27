import { DialogComponent } from '@/components';
import { TagSelectorProvider } from '@/contexts';
import {
  TagSelectorHeader,
  TagSelectorList,
  TagSelectorSearchBar,
} from '@/features/popup/components/selector';
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
    <DialogComponent isOpen={isOpen} onClose={onClose}>
      <TagSelectorProvider extension={extension}>
        <div className="flex flex-col gap-4">
          <TagSelectorHeader onClose={onClose} />
          <TagSelectorSearchBar />
          <TagSelectorList />
        </div>
      </TagSelectorProvider>
    </DialogComponent>
  );
};
