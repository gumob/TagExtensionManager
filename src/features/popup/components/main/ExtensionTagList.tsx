import {
  ExtensionTagListEditButton,
  ExtensionTagListItem,
  ExtensionTagMetricsChip,
} from '@/features/popup/components/main';
import { ExtensionModel } from '@/models';
import { useTagStore } from '@/stores';

/**
 * The props for the ExtensionTagList component.
 *
 * @param extensions - The extensions to display.
 * @param visibleTagId - The id of the visible tag.
 * @param setVisibleTag - The function to set the visible tag.
 */
export const ExtensionTagList = ({
  extensions,
  visibleTagId,
  setVisibleTag,
}: {
  extensions: ExtensionModel[];
  visibleTagId: string | null;
  setVisibleTag: (tagId: string | null) => void;
}) => {
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
        <ExtensionTagMetricsChip
          extensions={extensions}
          visibleTagId={visibleTagId}
          setVisibleTag={setVisibleTag}
        />
        <ExtensionTagListEditButton />
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <ExtensionTagListItem
            key={tag.id}
            tag={tag}
            visibleTagId={visibleTagId}
            setVisibleTag={setVisibleTag}
          />
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
            visibleTagId={visibleTagId}
            setVisibleTag={setVisibleTag}
          />
        )}
      </div>
    </>
  );
};
