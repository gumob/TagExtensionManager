/**
 * The extension type.
 *
 * @property id - The id of the extension.
 * @property name - The name of the extension.
 * @property version - The version of the extension.
 * @property enabled - Whether the extension is enabled.
 * @property description - The description of the extension.
 * @property iconUrl - The icon url of the extension.
 * @property locked - Whether the extension is locked.
 */
export interface ExtensionModel {
  id: string;
  name: string;
  description: string;
  optionsUrl: string;
  iconUrl: string;
  version: string;
  enabled: boolean;
  locked: boolean;
}

/**
 * The tag type.
 *
 * @property id - The id of the tag.
 * @property name - The name of the tag.
 * @property order - The order of the tag.
 * @property createdAt - The created at date of the tag.
 * @property updatedAt - The updated at date of the tag.
 */
export interface TagModel {
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
export interface TagExtensionMapModel {
  extensionId: string;
  tagIds: string[];
}

/**
 * The tag state type.
 *
 * @property tags - The tags.
 * @property extensionTags - The extension tags.
 */
export interface TagManagementModel {
  tags: TagModel[];
  extensionTags: TagExtensionMapModel[];
}
