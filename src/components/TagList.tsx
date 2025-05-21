import { TagChip } from '@/components/TagChip';
import { TagEditButton } from '@/components/TagEditButton';
import { TagShowAllButton } from '@/components/TagShowAllButton';
import { useTagStore } from '@/stores/tagStore';
import { Extension } from '@/types/extension';

export const TagList = ({ extensions }: { extensions: Extension[] }) => {
  const { tags, extensionTags } = useTagStore();

  // ExtensionList.tsxと同じロジック
  const untaggedExtensions = extensions.filter(
    ext => !extensionTags.find(extTag => extTag.extensionId === ext.id && extTag.tagIds.length > 0)
  );

  return (
    <div className="flex flex-wrap gap-1">
      <TagShowAllButton />
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
      <TagEditButton />
    </div>
  );
};
