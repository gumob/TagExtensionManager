import { useRef } from 'react';

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

export const TagEditorList: React.FC<TagEditorListProps> = ({
  tags,
  moveTag,
  editingTagId,
  onEdit,
  onDelete,
  onTagClick,
}: TagEditorListProps) => {
  const tagListRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-0 pb-4">
      <div ref={tagListRef} className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <TagEditorListItem
            key={tag.id}
            tag={tag}
            index={index}
            moveTag={moveTag}
            isEditing={editingTagId === tag.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
};
