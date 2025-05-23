import { TagChip, TagEditChip, TagMetricsChip } from '@/features/tag/components';
import { ExtensionModel } from '@/models';
import { useTagStore } from '@/stores';

/**
 * The props for the TagList component.
 *
 * @param extensions - The extensions to display.
 * @param visibleTagId - The id of the visible tag.
 * @param setVisibleTag - The function to set the visible tag.
 */
export const TagList = ({
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
   * The TagList component.
   *
   * @returns The TagList component.
   */
  return (
    <>
      <div className="flex flex-wrap gap-1 mb-1">
        <TagMetricsChip extensions={extensions} visibleTagId={visibleTagId} setVisibleTag={setVisibleTag} />
        <TagEditChip />
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <TagChip key={tag.id} tag={tag} visibleTagId={visibleTagId} setVisibleTag={setVisibleTag} />
        ))}
        {untaggedExtensions.length > 0 && (
          <TagChip
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
