import { useTagEditorContext } from '@/contexts/TagEditorContext';
import { TagEditorListItem } from '@/features/popup/components/editor';
import { TagModel } from '@/models';

interface TagEditorListProps {
  tags: TagModel[];
  moveTag: (dragIndex: number, hoverIndex: number) => void;
  editingTagId: string | null;
  onEdit: (tagId: string, newName: string, shouldCloseEdit?: boolean) => void;
  onDelete: (tagId: string) => void;
  onTagClick: (tagId: string) => void;
}

export const TagEditorList: React.FC = () => {
  const {
    sortedTags,
    moveTag,
    editingTagId,
    handleTagNameChange,
    handleDeleteClick,
    handleTagClick,
  } = useTagEditorContext();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-0 pb-4">
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag, index) => (
          <TagEditorListItem
            key={tag.id}
            tag={tag}
            index={index}
            moveTag={moveTag}
            isEditing={editingTagId === tag.id}
            onEdit={handleTagNameChange}
            onDelete={handleDeleteClick}
            onTagClick={handleTagClick}
          />
        ))}
      </div>
    </div>
  );
};
