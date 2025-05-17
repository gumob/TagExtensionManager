export class ThemeToggle {
  private button: HTMLButtonElement;
  private isDarkMode: boolean;

  constructor() {
    this.button = document.createElement('button');
    this.button.className = 'theme-toggle';
    this.isDarkMode = this.getInitialThemeState();
    this.initialize();
  }

  private getInitialThemeState(): boolean {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private initialize() {
    this.button.innerHTML = this.isDarkMode ? '<span class="material-icons-outlined">dark_mode</span>' : '<span class="material-icons-outlined">light_mode</span>';
    this.button.title = this.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    this.button.addEventListener('click', () => this.toggleTheme());
    this.applyTheme();
  }

  private toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.button.innerHTML = this.isDarkMode ? '<span class="material-icons-outlined">dark_mode</span>' : '<span class="material-icons-outlined">light_mode</span>';
    this.button.title = this.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  public render(container: HTMLElement) {
    container.appendChild(this.button);
  }
} 