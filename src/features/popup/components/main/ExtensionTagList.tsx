import { useExtensionContext } from '@/contexts/ExtensionContext';
import {
  ExtensionTagListEditButton,
  ExtensionTagListItem,
  ExtensionTagMetrics,
} from '@/features/popup/components/main';
import { useTagStore } from '@/stores';

type ExtensionTagListProps = {};

/**
 * The props for the ExtensionTagList component.
 *
 * @param extensions - The extensions to display.
 */
export const ExtensionTagList: React.FC<ExtensionTagListProps> = ({}: ExtensionTagListProps) => {
  /**
   * The extensions and filtered extensions.
   */
  const {
    extensions: { filteredExtensions },
  } = useExtensionContext();
  /**
   * The tag store.
   */
  const { tags, extensionTags } = useTagStore();

  /**
   * The untagged extensions.
   */
  const untaggedExtensions = filteredExtensions.filter(
    ext => !extensionTags.find(extTag => extTag.extensionId === ext.id && extTag.tagIds.length > 0)
  );

  /**
   * The ExtensionTagList component.
   *
   * @returns The ExtensionTagList component.
   */
  return (
    <>
      <div className="flex flex-wrap gap-1 mb-1">
        <ExtensionTagMetrics extensions={filteredExtensions} />
        <ExtensionTagListEditButton />
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <ExtensionTagListItem key={tag.id} tag={tag} />
        ))}
        {untaggedExtensions.length > 0 && (
          <ExtensionTagListItem
            tag={{
              id: 'untagged',
              name: 'Untagged',
              order: tags.length,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            extensionCount={untaggedExtensions.length}
          />
        )}
      </div>
    </>
  );
};
