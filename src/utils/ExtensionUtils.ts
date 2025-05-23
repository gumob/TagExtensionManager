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
export const getAllExtensions = (): Promise<Extension[]> => {
  return new Promise(resolve => {
    if (typeof chrome !== 'undefined' && chrome.management) {
      chrome.management.getAll(extensions => {
        const formattedExtensions = extensions.map(formatExtension);
        formattedExtensions.sort((a, b) => a.name.localeCompare(b.name));
        resolve(formattedExtensions);
      });
    } else {
      resolve([]);
    }
  });
};

/**
 * Toggle the extension.
 * @param id - The id of the extension.
 * @param enabled - Whether the extension is enabled.
 * @returns The promise.
 */
export const toggleExtension = (id: string, enabled: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.management) {
      chrome.management.setEnabled(id, enabled, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      reject(new Error('Chrome management API not available'));
    }
  });
};
