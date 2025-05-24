import {
  ExtensionTagListEditButton,
  ExtensionTagListItem,
  ExtensionTagMetrics,
} from '@/features/popup/components/main';
import { ExtensionModel } from '@/models';
import { useTagStore } from '@/stores';

/**
 * The props for the ExtensionTagList component.
 *
 * @param extensions - The extensions to display.
 */
interface ExtensionTagListProps {
  extensions: ExtensionModel[];
}

/**
 * The props for the ExtensionTagList component.
 *
 * @param extensions - The extensions to display.
 */
export const ExtensionTagList: React.FC<ExtensionTagListProps> = ({
  extensions,
}: ExtensionTagListProps) => {
  /**
   * The tag store.
   */
  const { tags, extensionTags } = useTagStore();

  /**
   * The untagged extensions.
   */
  const untaggedExtensions = extensions.filter(
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
        <ExtensionTagMetrics extensions={extensions} />
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
