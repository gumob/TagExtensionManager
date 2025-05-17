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

    // const description = document.createElement('p');
    // description.className = 'extension-description';
    // description.textContent = extension.description;

    const controls = document.createElement('div');
    controls.className = 'extension-controls';

    // Custom Switch
    const switchContainer = document.createElement('label');
    switchContainer.className = 'switch';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = extension.enabled;
    checkbox.addEventListener('change', () => {
      if (this.onToggleCallback) {
        this.onToggleCallback(extension.id, checkbox.checked);
      }
    });

    const switchTrack = document.createElement('span');
    switchTrack.className = 'switch-track';

    const switchThumb = document.createElement('span');
    switchThumb.className = 'switch-thumb';

    switchContainer.appendChild(checkbox);
    switchContainer.appendChild(switchTrack);
    switchContainer.appendChild(switchThumb);

    // Settings Icon
    const settingsIcon = document.createElement('span');
    settingsIcon.className = 'settings-icon';
    settingsIcon.textContent = 'settings';
    settingsIcon.title = 'Extension Settings';
    settingsIcon.addEventListener('click', () => {
      // Get the current browser's extension management URL
      const browser = navigator.userAgent.toLowerCase();
      let baseUrl = 'chrome://extensions';
      
      if (browser.includes('brave')) {
        baseUrl = 'brave://extensions';
      } else if (browser.includes('edg')) {
        baseUrl = 'edge://extensions';
      } else if (browser.includes('opera')) {
        baseUrl = 'opera://extensions';
      } else if (browser.includes('vivaldi')) {
        baseUrl = 'vivaldi://extensions';
      }

      // Open the extension details page
      chrome.tabs.create({ url: `${baseUrl}/?id=${extension.id}` });
    });

    controls.appendChild(switchContainer);
    controls.appendChild(settingsIcon);

    info.appendChild(name);
    // info.appendChild(description);
    div.appendChild(icon);
    div.appendChild(info);
    div.appendChild(controls);

    return div;
  }

  onToggleExtension(callback: (extensionId: string, enabled: boolean) => void) {
    this.onToggleCallback = callback;
  }
} 