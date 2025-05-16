interface Extension {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  iconUrl: string;
}

export class ExtensionList {
  private container: HTMLElement;
  private onToggleCallback: ((extensionId: string, enabled: boolean) => void) | null = null;

  constructor() {
    this.container = document.getElementById('extensionsList') as HTMLElement;
    if (!this.container) {
      console.error('[Extension Manager] Container element #extensionsList not found');
    } else {
      console.debug('[Extension Manager] Container element found:', this.container);
    }
  }

  render(extensions: Extension[]) {
    console.debug('[Extension Manager] Rendering extensions:', extensions);
    if (!this.container) {
      console.error('[Extension Manager] Cannot render: container element not found');
      return;
    }

    this.container.innerHTML = '';
    extensions.forEach((extension) => {
      const element = this.createExtensionElement(extension);
      this.container.appendChild(element);
      console.debug('[Extension Manager] Added extension element:', extension.name);
    });
  }

  private createExtensionElement(extension: Extension): HTMLElement {
    console.debug('[Extension Manager] Creating element for extension:', extension.name);
    const div = document.createElement('div');
    div.className = 'extension-item';

    const icon = document.createElement('img');
    icon.className = 'extension-icon';
    icon.src = extension.iconUrl;
    icon.alt = extension.name;

    const info = document.createElement('div');
    info.className = 'extension-info';

    const name = document.createElement('h3');
    name.className = 'extension-name';
    name.textContent = extension.name;

    const description = document.createElement('p');
    description.className = 'extension-description';
    description.textContent = extension.description;

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.className = 'extension-toggle';
    toggle.checked = extension.enabled;
    toggle.addEventListener('change', () => {
      if (this.onToggleCallback) {
        this.onToggleCallback(extension.id, toggle.checked);
      }
    });

    info.appendChild(name);
    info.appendChild(description);
    div.appendChild(icon);
    div.appendChild(info);
    div.appendChild(toggle);

    return div;
  }

  onToggleExtension(callback: (extensionId: string, enabled: boolean) => void) {
    this.onToggleCallback = callback;
  }
} 