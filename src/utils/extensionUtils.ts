import { Extension } from '@/types/extension';

export const findOptimalIcon = (icons: chrome.management.IconInfo[] | undefined): string => {
  if (!icons || icons.length === 0) return '';
  
  const preferredSizes = [48, 36, 32, 24, 16];
  
  for (const size of preferredSizes) {
    const icon = icons.find(icon => icon.size === size);
    if (icon) return icon.url;
  }
  
  return icons[0].url;
};

export const formatExtension = (ext: chrome.management.ExtensionInfo): Extension => ({
  id: ext.id,
  name: ext.name,
  version: ext.version || '',
  enabled: ext.enabled,
  description: ext.description || '',
  iconUrl: findOptimalIcon(ext.icons),
});

export const getAllExtensions = (): Promise<Extension[]> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.management) {
      chrome.management.getAll((extensions) => {
        const formattedExtensions = extensions.map(formatExtension);
        formattedExtensions.sort((a, b) => a.name.localeCompare(b.name));
        resolve(formattedExtensions);
      });
    } else {
      resolve([]);
    }
  });
};

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