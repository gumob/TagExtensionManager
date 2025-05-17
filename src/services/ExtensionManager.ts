interface Extension {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  iconUrl: string;
}

export class ExtensionManager {
  private getBestIconUrl(icons: chrome.management.IconInfo[] | undefined): string {
    if (!icons || icons.length === 0) return '';
    
    const preferredSizes = [48, 36, 32, 24, 16];
    
    for (const size of preferredSizes) {
      const icon = icons.find(icon => icon.size === size);
      if (icon) return icon.url;
    }
    
    // 優先サイズが見つからない場合は最初のアイコンを使用
    return icons[0].url;
  }

  async getAllExtensions(): Promise<Extension[]> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.management) {
        chrome.management.getAll((extensions) => {
          const formattedExtensions = extensions.map((ext) => ({
            id: ext.id,
            name: ext.name,
            version: ext.version || '',
            enabled: ext.enabled,
            description: ext.description || '',
            iconUrl: ext.icons?.[0]?.url || '',
          }));
          formattedExtensions.sort((a, b) => a.name.localeCompare(b.name));
          resolve(formattedExtensions);
        });
      } else {
        resolve([]);
      }
    });
  }

  async toggleExtension(id: string, enabled: boolean): Promise<void> {
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
  }

  filterExtensions(query: string, extensions: Extension[]): Extension[] {
    const searchQuery = query.toLowerCase();
    return extensions.filter((ext) => {
      return (
        ext.name.toLowerCase().includes(searchQuery) ||
        ext.description.toLowerCase().includes(searchQuery)
      );
    });
  }
} 