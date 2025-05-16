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
    this.extensions = await this.extensionManager.getAllExtensions();
    this.extensionList.render(this.extensions);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.searchBar.onSearch((query: string) => {
      const filteredExtensions = this.extensionManager.filterExtensions(query, this.extensions);
      this.extensionList.render(filteredExtensions);
    });

    this.extensionList.onToggleExtension(async (extensionId: string, enabled: boolean) => {
      await this.extensionManager.toggleExtension(extensionId, enabled);
      this.extensions = await this.extensionManager.getAllExtensions();
      this.extensionList.render(this.extensions);
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Popup();
}); 