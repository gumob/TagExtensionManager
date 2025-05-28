import { Message, MessageResponse } from '@/types';
import { logger } from '@/utils';

/**
 * The Chrome API class.
 */
export class ChromeAPI {
  /**
   * The instance of the Chrome API.
   */
  private static instance: ChromeAPI;

  /**
   * The constructor.
   */
  private constructor() {}

  /**
   * The get instance method.
   * @returns The instance of the Chrome API.
   */
  public static getInstance(): ChromeAPI {
    if (!ChromeAPI.instance) {
      ChromeAPI.instance = new ChromeAPI();
    }
    return ChromeAPI.instance;
  }

  /************************************************
   * Storage API
   ************************************************/

  /**
   * The function that gets local storage.
   * @param key - The key.
   * @returns The value.
   */
  public async getLocalStorage(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }> {
    try {
      const result = await chrome.storage.local.get(keys);
      return result;
    } catch (error) {
      logger.warn('Failed to get value from storage', error);
      throw error;
    }
  }

  /**
   * The function that sets local storage.
   * @param items - The items.
   */
  public async setLocalStorage(items: { [key: string]: any }): Promise<void> {
    try {
      await chrome.storage.local.set(items);
    } catch (error) {
      logger.warn('Failed to set value in storage', error);
      throw error;
    }
  }

  /**
   * The function that removes local storage.
   * @param key - The key.
   */
  public async removeLocalStorage(key: string): Promise<void> {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      logger.warn('Failed to remove value from storage', error);
      throw error;
    }
  }

  /**
   * The function that clears local storage.
   */
  public async clearLocalStorage(): Promise<void> {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      logger.warn('Failed to clear local storage', error);
      throw error;
    }
  }

  /************************************************
   * Tab API
   ************************************************/

  /**
   * The function that gets current tab.
   * @returns The current tab.
   */
  public async getCurrentTab(): Promise<chrome.tabs.Tab | null> {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      return tab || null;
    } catch (error) {
      logger.warn('Failed to get current tab', error);
      throw error;
    }
  }

  /**
   * The function that creates a new tab.
   * @param extensionId - The extension id.
   * @returns The created tab.
   */
  public async createTab(extensionId: string): Promise<chrome.tabs.Tab> {
    try {
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
      const url = `${baseUrl}/?id=${extensionId}`;
      return await chrome.tabs.create({ url, active: true });
    } catch (error) {
      logger.warn('Failed to create tab', error);
      throw error;
    }
  }

  /************************************************
   * Message API
   ************************************************/

  /**
   * The function that sends a message.
   * @param tabId - The tab id.
   * @param message - The message.
   * @returns The message response.
   */
  public async sendMessage<T>(tabId: number, message: Message): Promise<MessageResponse<T>> {
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      logger.warn('Failed to send message to tab', error);
      throw error;
    }
  }

  /************************************************
   * Runtime API
   ************************************************/

  /**
   * The function that sends a runtime message.
   * @param message - The message.
   * @returns The message response.
   */
  public async sendRuntimeMessage<T = any>(message: T): Promise<T> {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch (error) {
      logger.warn('Failed to send runtime message', error);
      throw error;
    }
  }

  /**
   * The function that adds a message listener.
   * @param callback - The callback.
   */
  public addMessageListener(callback: (message: Message, sender: chrome.runtime.MessageSender) => void): void {
    chrome.runtime.onMessage.addListener(callback);
  }

  /************************************************
   * Action API
   ************************************************/

  /**
   * The function that sets the extension icon.
   * @param icon - The icon details.
   */
  public async setIcon(icon: chrome.action.TabIconDetails): Promise<void> {
    try {
      await chrome.action.setIcon(icon);
    } catch (error) {
      logger.warn('Failed to set icon', error);
      throw error;
    }
  }

  /************************************************
   * Management API
   ************************************************/

  /**
   * The function that gets all extensions.
   * @returns The extensions.
   */
  public async getAllExtensions(): Promise<chrome.management.ExtensionInfo[]> {
    try {
      return await new Promise(resolve => {
        chrome.management.getAll(resolve);
      });
    } catch (error) {
      logger.warn('Failed to get all extensions', error);
      throw error;
    }
  }

  /**
   * The function that gets extension info.
   * @param id - The extension id.
   * @returns The extension info.
   */
  public async getExtensionInfo(id: string): Promise<chrome.management.ExtensionInfo> {
    try {
      return await new Promise((resolve, reject) => {
        chrome.management.get(id, result => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      logger.warn('Failed to get extension info', error);
      throw error;
    }
  }

  /**
   * The function that toggles the extension state.
   * @param id - The extension id.
   * @param enabled - Whether the extension is enabled.
   */
  public async toggleExtension(id: string, enabled: boolean): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        chrome.management.setEnabled(id, enabled, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      logger.warn('Failed to toggle extension', error);
      throw error;
    }
  }

  /**
   * The function that uninstalls an extension.
   * @param id - The extension id.
   */
  public async uninstallExtension(id: string): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        chrome.management.uninstall(id, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      logger.warn('Failed to uninstall extension', error);
      throw error;
    }
  }

  /************************************************
   * Offscreen API
   ************************************************/

  /**
   * The function that checks if an offscreen document exists.
   * @returns Whether the offscreen document exists.
   */
  public async hasOffscreenDocument(): Promise<boolean> {
    try {
      return await chrome.offscreen.hasDocument();
    } catch (error) {
      logger.warn('Failed to check offscreen document', error);
      throw error;
    }
  }

  /**
   * The function that creates an offscreen document.
   * @param url - The URL.
   * @param reasons - The reasons.
   * @param justification - The justification.
   */
  public async createOffscreenDocument(url: string, reasons: chrome.offscreen.Reason[], justification: string): Promise<void> {
    try {
      await chrome.offscreen.createDocument({
        url,
        reasons,
        justification,
      });
    } catch (error) {
      logger.warn('Failed to create offscreen document', error);
      throw error;
    }
  }

  /**
   * The function that closes an offscreen document.
   */
  public async closeOffscreenDocument(): Promise<void> {
    try {
      await chrome.offscreen.closeDocument();
    } catch (error) {
      logger.warn('Failed to close offscreen document', error);
      throw error;
    }
  }
}

export const chromeAPI = ChromeAPI.getInstance();
