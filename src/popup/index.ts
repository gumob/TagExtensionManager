import { ExtensionManager } from '../services/ExtensionManager';
import { ExtensionList } from '../components/ExtensionList';
import { SearchBar } from '../components/SearchBar';

class Popup {
  private extensionManager: ExtensionManager;
  private extensionList: ExtensionList;
  private searchBar: SearchBar;
  private extensions: any[] = [];

  constructor() {
    this.extensionManager = new ExtensionManager();
    this.extensionList = new ExtensionList();
    this.searchBar = new SearchBar();
    this.initialize();
  }

  private async initialize() {
    try {
      console.debug('[Extension Manager] Fetching extensions...');
      this.extensions = await this.extensionManager.getAllExtensions();
      console.debug('[Extension Manager] Fetched extensions:', this.extensions);
      
      if (this.extensions.length === 0) {
        console.warn('[Extension Manager] No extensions found');
      }
      
      this.extensionList.render(this.extensions);
      this.setupEventListeners();
    } catch (error) {
      console.error('[Extension Manager] Error initializing popup:', error);
    }
  }

  private setupEventListeners() {
    this.searchBar.onSearch((query: string) => {
      const filteredExtensions = this.extensionManager.filterExtensions(query, this.extensions);
      this.extensionList.render(filteredExtensions);
    });

    this.extensionList.onToggleExtension(async (extensionId: string, enabled: boolean) => {
      try {
        await this.extensionManager.toggleExtension(extensionId, enabled);
        this.extensions = await this.extensionManager.getAllExtensions();
        this.extensionList.render(this.extensions);
      } catch (error) {
        console.error('[Extension Manager] Error toggling extension:', error);
      }
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Popup();
}); 