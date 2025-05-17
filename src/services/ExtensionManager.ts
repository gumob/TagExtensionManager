interface Extension {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
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
      chrome.management.getAll((extensions) => {
        console.debug('[Extension Manager] Fetched extensions:', extensions);
        const formattedExtensions = extensions.map((ext) => ({
          id: ext.id,
          name: ext.name,
          description: ext.description || '',
          enabled: ext.enabled,
          iconUrl: this.getBestIconUrl(ext.icons),
        }));
        formattedExtensions.sort((a, b) => a.name.localeCompare(b.name));
        resolve(formattedExtensions);
      });
    });
  }

  async toggleExtension(extensionId: string, enabled: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.management.setEnabled(extensionId, enabled, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
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