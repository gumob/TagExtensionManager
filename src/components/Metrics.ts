interface Extension {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  iconUrl: string;
}

export class Metrics {
  private container: HTMLElement | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.createContainer();
  }

  private createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'metrics-container';
    this.container.innerHTML = `
      <div class="metrics-item metrics-total">
        <span class="metrics-title">Total</span>
        <span class="metrics-value" id="metrics-total-value">0</span>
      </div>
      <div class="metrics-item metrics-enabled">
        <span class="metrics-title">Enabled</span>
        <span class="metrics-value" id="metrics-enabled-value">0</span>
      </div>
      <div class="metrics-item metrics-disabled">
        <span class="metrics-title">Disabled</span>
        <span class="metrics-value" id="metrics-disabled-value">0</span>
      </div>
    `;
  }

  public render(container: HTMLElement) {
    if (!this.container) return;
    container.insertBefore(this.container, container.firstElementChild);
  }

  public update(extensions: Extension[]) {
    if (!this.container) return;
    
    const total = extensions.length;
    const enabled = extensions.filter(ext => ext.enabled).length;
    const disabled = total - enabled;

    const totalEl = document.getElementById('metrics-total-value');
    const enabledEl = document.getElementById('metrics-enabled-value');
    const disabledEl = document.getElementById('metrics-disabled-value');

    if (totalEl) totalEl.textContent = String(total);
    if (enabledEl) enabledEl.textContent = String(enabled);
    if (disabledEl) disabledEl.textContent = String(disabled);
  }
} 