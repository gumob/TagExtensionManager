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
export interface Extension {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  iconUrl: string;
  locked: boolean;
}
