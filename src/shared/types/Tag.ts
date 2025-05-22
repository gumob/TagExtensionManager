/**
 * The tag type.
 *
 * @property id - The id of the tag.
 * @property name - The name of the tag.
 * @property order - The order of the tag.
 * @property createdAt - The created at date of the tag.
 * @property updatedAt - The updated at date of the tag.
 */
export interface Tag {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The extension tag type.
 *
 * @property extensionId - The id of the extension.
 * @property tagIds - The ids of the tags.
 */
export interface ExtensionTag {
  extensionId: string;
  tagIds: string[];
}

/**
 * The tag state type.
 *
 * @property tags - The tags.
 * @property extensionTags - The extension tags.
 * @property visibleTagId - The id of the visible tag.
 */
export interface TagState {
  tags: Tag[];
  extensionTags: ExtensionTag[];
  visibleTagId: string | null /** Show all tags if null */;
}

/**
 * The tag store type.
 *
 * @property addTag - The add tag function.
 * @property updateTag - The update tag function.
 * @property deleteTag - The delete tag function.
 * @property reorderTags - The reorder tags function.
 * @property addTagToExtension - The add tag to extension function.
 * @property removeTagFromExtension - The remove tag from extension function.
 */
export interface TagStore extends TagState {
  addTag: (name: string) => void;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  reorderTags: (tagIds: string[]) => void;
  addTagToExtension: (extensionId: string, tagId: string) => void;
  removeTagFromExtension: (extensionId: string, tagId: string) => void;
  importTags: (tags: Tag[], extensionTags: ExtensionTag[]) => void;
  exportTags: () => { tags: Tag[]; extensionTags: ExtensionTag[] };
  initialize: () => void;
  setVisibleTag: (tagId: string | null) => void;
  showAllTags: () => void;
  isLoading: boolean;
}
