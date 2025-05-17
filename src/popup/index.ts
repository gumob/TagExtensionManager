import { ExtensionManager } from '../services/ExtensionManager';
import { ExtensionList } from '../components/ExtensionList';
import { SearchBar } from '../components/SearchBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { Metrics } from '../components/Metrics';

class Popup {
  private extensionManager: ExtensionManager;
  private extensionList: ExtensionList;
  private searchBar: SearchBar;
  private themeToggle: ThemeToggle;
  private metrics: Metrics;
  private extensions: any[] = [];

  constructor() {
    this.extensionManager = new ExtensionManager();
    this.extensionList = new ExtensionList();
    this.searchBar = new SearchBar();
    this.themeToggle = new ThemeToggle();
    this.metrics = new Metrics();
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
      
      const main = document.querySelector('main');
      if (main) {
        this.metrics.render(main);
      }
      this.metrics.update(this.extensions);
      this.extensionList.render(this.extensions);
      this.setupEventListeners();
      this.setupThemeToggle();
    } catch (error) {
      console.error('[Extension Manager] Error initializing popup:', error);
    }
  }

  private setupEventListeners() {
    this.searchBar.onSearch((query: string) => {
      const filteredExtensions = this.extensionManager.filterExtensions(query, this.extensions);
      this.extensionList.render(filteredExtensions);
      this.metrics.update(filteredExtensions);
    });

    this.extensionList.onToggleExtension(async (extensionId: string, enabled: boolean) => {
      try {
        await this.extensionManager.toggleExtension(extensionId, enabled);
        this.extensions = await this.extensionManager.getAllExtensions();
        this.extensionList.render(this.extensions);
        this.metrics.update(this.extensions);
      } catch (error) {
        console.error('[Extension Manager] Error toggling extension:', error);
      }
    });
  }

  private setupThemeToggle() {
    const header = document.querySelector('header');
    if (header) {
      this.themeToggle.render(header);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Popup();
}); 