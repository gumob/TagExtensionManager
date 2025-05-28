import { ExtensionModel } from '@/models';

/**
 * This function finds the best icon size for an extension from its available icons.
 * Process:
 * 1. First checks if icons exist, returns empty string if not
 * 2. Starts searching from size 48px and gradually decreases
 * 3. Returns the first matching icon URL at desired size
 * 4. If no ideal size found, falls back to the first available icon
 *
 * @param icons - Array of available icons with different sizes
 * @returns The URL of the optimal icon
 */
export const findOptimalIcon = (icons: chrome.management.IconInfo[] | undefined): string => {
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
 * This function transforms raw Chrome extension data into our application's format.
 * Process:
 * 1. Gets stored extension data from our global store
 * 2. Checks if extension is locked in our store
 * 3. Creates a standardized extension object with:
 *    - Basic info (id, name, version)
 *    - State info (enabled, locked)
 *    - Display info (description, icon)
 *
 * @param ext - Raw Chrome extension information
 * @param storedExtensions - Current extensions from the store
 * @returns Formatted extension data for our app
 */
export const mapExtensionInfoToExtensionModel = (ext: chrome.management.ExtensionInfo, storedExtensions: ExtensionModel[] = []): ExtensionModel => {
  const storedExtension = storedExtensions.find(e => e.id === ext.id);
  const isLocked = storedExtension?.locked ?? false;

  return {
    id: ext.id,
    name: ext.name,
    description: ext.description || '',
    optionsUrl: ext.optionsUrl || '',
    iconUrl: findOptimalIcon(ext.icons),
    version: ext.version || '',
    enabled: ext.enabled,
    locked: isLocked,
  };
};
