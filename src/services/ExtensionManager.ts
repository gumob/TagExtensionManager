interface Extension {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  iconUrl: string;
}

export class ExtensionManager {
  async getAllExtensions(): Promise<Extension[]> {
    return new Promise((resolve) => {
      chrome.management.getAll((extensions) => {
        const formattedExtensions = extensions.map((ext) => ({
          id: ext.id,
          name: ext.name,
          description: ext.description || '',
          enabled: ext.enabled,
          iconUrl: ext.icons?.[0]?.url || '',
        }));
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