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
    extensions: { untaggedExtensions },
  } = useExtensionContext();

  /**
   * The tag store.
   */
  const { tags, extensionTags } = useTagStore();

  /**
   * The ExtensionTagList component.
   *
   * @returns The ExtensionTagList component.
   */
  return (
    <>
      <div className="flex flex-wrap gap-1 mb-1">
        <ExtensionTagMetrics />
        <ExtensionTagListEditButton />
      </div>
      <div className="flex flex-wrap gap-1">
        {/* Tagged chip */}
        {tags.map(tag => (
          <ExtensionTagListItem key={tag.id} tag={tag} />
        ))}
        {/* Untagged chip */}
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
