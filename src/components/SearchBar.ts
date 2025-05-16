export class SearchBar {
  private input: HTMLInputElement;
  private onSearchCallback: ((query: string) => void) | null = null;

  constructor() {
    this.input = document.getElementById('search') as HTMLInputElement;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.input.addEventListener('input', () => {
      if (this.onSearchCallback) {
        this.onSearchCallback(this.input.value);
      }
    });
  }

  onSearch(callback: (query: string) => void) {
    this.onSearchCallback = callback;
  }
} 