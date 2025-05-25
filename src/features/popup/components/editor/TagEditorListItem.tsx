import { TagIcon, XMarkIcon } from '@heroicons/react/24/outline';

import React, { useEffect, useRef } from 'react';

import { useDrag, useDrop } from 'react-dnd';

import { useTagEditorContext } from '@/contexts/TagEditorContext';
import { TagModel } from '@/models';

/**
 * The props for the TagEditorListItem component.
 * @param tag - The tag data.
 * @param index - The index of the tag.
 */
interface TagEditorListItemProps {
  tag: TagModel;
  index: number;
}

/**
 * The TagEditorListItem component.
 *
 * @param tag - The tag data.
 * @param index - The index of the tag.
 */
export const TagEditorListItem: React.FC<TagEditorListItemProps> = React.memo(
  ({ tag, index }: TagEditorListItemProps) => {
    /**
     * The data for the drag and drop operation.
     * @param id - The id of the tag.
     * @param index - The index of the tag.
     */
    interface DragData {
      id: string;
      index: number;
    }

    const { moveTag, editingTagId, handleTagNameChange, handleDeleteClick, handleTagClick } =
      useTagEditorContext();

    /**
     * The ref for the tag item.
     */
    const ref = useRef<HTMLDivElement>(null);

    /**
     * The ref for the input element.
     */
    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * The drag and drop state.
     */
    const [{ isDragging }, drag] = useDrag({
      type: 'TAG',
      item: { id: tag.id, index },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    });

    /**
     * The drop state.
     */
    const [, drop] = useDrop({
      accept: 'TAG',
      hover: (item: DragData, monitor) => {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const clientOffset = monitor.getClientOffset();

        if (!clientOffset) {
          return;
        }

        const hoverClientX = clientOffset.x - hoverBoundingRect.left;

        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
          return;
        }

        moveTag(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    /**
     * The drag and drop element.
     */
    drag(drop(ref));

    /**
     * The use effect for the tag item.
     */
    useEffect(() => {
      if (editingTagId === tag.id && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [editingTagId]);

    /**
     * The tag item.
     */
    return (
      <div
        ref={ref}
        className={`relative group transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95' : ''
        }`}
        style={{ width: 'fit-content' }}
      >
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm">
            <div className="flex items-center gap-1">
              <div className="cursor-grab active:cursor-grabbing touch-none select-none">
                <TagIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div>
                {editingTagId === tag.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={tag.name}
                    onChange={e => handleTagNameChange(tag.id, e.target.value, false)}
                    onBlur={() => handleTagNameChange(tag.id, tag.name, true)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagNameChange(tag.id, tag.name, true);
                      }
                    }}
                    size={Math.max(tag.name.length, 1)}
                    className="px-1 py-0.5 rounded-sm bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-zinc-100 dark:focus:bg-zinc-600 focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => handleTagClick(tag.id)}
                    className="select-none px-1 py-0.5 text-zinc-900 dark:text-zinc-100"
                  >
                    {tag.name}
                  </button>
                )}
              </div>
              <button
                onClick={() => handleDeleteClick(tag.id)}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TagEditorListItem.displayName = 'TagEditorListItem';
