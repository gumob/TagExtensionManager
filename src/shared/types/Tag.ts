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
