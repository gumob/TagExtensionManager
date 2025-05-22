import { TagChip, TagEditChip, TagMetricsChip } from '@/features/tag/components';
import { useTagStore } from '@/shared/stores';
import { Extension } from '@/shared/types';

/**
 * The props for the TagList component.
 *
 * @param extensions - The extensions to display.
 */
export const TagList = ({ extensions }: { extensions: Extension[] }) => {
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
        <TagMetricsChip extensions={extensions} />
        <TagEditChip />
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <TagChip key={tag.id} tag={tag} />
        ))}
        {untaggedExtensions.length > 0 && (
          <TagChip
            tag={{
              id: 'untagged',
              name: 'Untagged',
              order: tags.length,
              createdAt: '',
              updatedAt: '',
            }}
            extensionCount={untaggedExtensions.length}
          />
        )}
      </div>
    </>
  );
};
