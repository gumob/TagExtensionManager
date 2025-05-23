import { chromeAPI } from '@/api/chrome';
import { Extension } from '@/models';
import { useExtensionStore } from '@/stores';

/**
 * Find the optimal icon from the given icons.
 * @param icons
 * @returns
 */
const findOptimalIcon = (icons: chrome.management.IconInfo[] | undefined): string => {
  if (!icons || icons.length === 0) return '';

  /** Search for the optimal icon */
  let targetSize = 48;
  while (targetSize > 0) {
    const icon = icons.find(icon => icon.size === targetSize);
    if (icon) return icon.url;
    targetSize -= 2;
  }

  /** If no appropriate size is found, use the first icon */
  return icons[0].url;
};

/**
 * Format the extension.
 * @param ext - The extension.
 * @returns The formatted extension.
 */
export const formatExtension = (ext: chrome.management.ExtensionInfo): Extension => {
  const { extensions } = useExtensionStore.getState();
  const storedExtension = extensions.find(e => e.id === ext.id);
  const isLocked = storedExtension?.locked ?? false;

  return {
    id: ext.id,
    name: ext.name,
    version: ext.version || '',
    enabled: ext.enabled,
    description: ext.description || '',
    iconUrl: findOptimalIcon(ext.icons),
    locked: isLocked,
  };
};

/**
 * Get all extensions.
 * @returns The extensions.
 */
export const getAllExtensions = async (): Promise<Extension[]> => {
  const extensions = await chromeAPI.getAllExtensions();
  const formattedExtensions = extensions.map(formatExtension);
  formattedExtensions.sort((a, b) => a.name.localeCompare(b.name));
  return formattedExtensions;
};

/**
 * Toggle the extension.
 * @param id - The id of the extension.
 * @param enabled - Whether the extension is enabled.
 * @returns The promise.
 */
export const toggleExtension = async (id: string, enabled: boolean): Promise<void> => {
  await chromeAPI.toggleExtension(id, enabled);
};
