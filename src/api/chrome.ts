import { Storage } from '@plasmohq/storage';

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
   * The storage instance.
   */
  private storage: Storage;

  /**
   * The constructor.
   */
  private constructor() {
    this.storage = new Storage();
  }

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

  // Storage API
  /**
   * The get method.
   * @param key - The key.
   * @returns The value.
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.storage.get<T>(key);
      return value ?? null;
    } catch (error) {
      logger.error('Failed to get value from storage', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * The set method.
   * @param key - The key.
   * @param value - The value.
   */
  public async set<T>(key: string, value: T): Promise<void> {
    try {
      await this.storage.set(key, value);
    } catch (error) {
      logger.error('Failed to set value in storage', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * The remove method.
   * @param key - The key.
   */
  public async remove(key: string): Promise<void> {
    try {
      await this.storage.remove(key);
    } catch (error) {
      logger.error('Failed to remove value from storage', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * The clear method.
   */
  public async clear(): Promise<void> {
    try {
      await this.storage.clear();
    } catch (error) {
      logger.error('Failed to clear storage', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  // Tabs API
  /**
   * The get current tab method.
   * @returns The current tab.
   */
  public async getCurrentTab(): Promise<chrome.tabs.Tab | null> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab || null;
    } catch (error) {
      logger.error('Failed to get current tab', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * Create a new tab.
   * @param url - The URL to open.
   * @returns The created tab.
   */
  public async createTab(url: string): Promise<chrome.tabs.Tab> {
    try {
      return await chrome.tabs.create({ url, active: true });
    } catch (error) {
      logger.error('Failed to create tab', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * The send message method.
   * @param tabId - The tab id.
   * @param message - The message.
   * @returns The message response.
   */
  public async sendMessage<T>(tabId: number, message: Message): Promise<MessageResponse<T>> {
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      logger.error('Failed to send message to tab', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  // Runtime API
  /**
   * The send runtime message method.
   * @param message - The message.
   * @returns The message response.
   */
  public async sendRuntimeMessage<T = any>(message: T): Promise<T> {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch (error) {
      logger.error('Failed to send runtime message', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * The add message listener method.
   * @param callback - The callback.
   */
  public addMessageListener(
    callback: (message: Message, sender: chrome.runtime.MessageSender) => void
  ): void {
    chrome.runtime.onMessage.addListener(callback);
  }

  // Action API
  /**
   * Set the extension icon.
   * @param icon - The icon details.
   */
  public async setIcon(icon: chrome.action.TabIconDetails): Promise<void> {
    try {
      await chrome.action.setIcon(icon);
    } catch (error) {
      logger.error('Failed to set icon', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  // Management API
  /**
   * Get all extensions.
   * @returns The extensions.
   */
  public async getAllExtensions(): Promise<chrome.management.ExtensionInfo[]> {
    try {
      return await new Promise(resolve => {
        chrome.management.getAll(resolve);
      });
    } catch (error) {
      logger.error('Failed to get all extensions', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * Get extension info.
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
      logger.error('Failed to get extension info', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * Toggle extension state.
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
      logger.error('Failed to toggle extension', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * Uninstall extension.
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
      logger.error('Failed to uninstall extension', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  // Offscreen API
  /**
   * Check if offscreen document exists.
   * @returns Whether the offscreen document exists.
   */
  public async hasOffscreenDocument(): Promise<boolean> {
    try {
      return await chrome.offscreen.hasDocument();
    } catch (error) {
      logger.error('Failed to check offscreen document', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * Create offscreen document.
   * @param url - The URL.
   * @param reasons - The reasons.
   * @param justification - The justification.
   */
  public async createOffscreenDocument(
    url: string,
    reasons: chrome.offscreen.Reason[],
    justification: string
  ): Promise<void> {
    try {
      await chrome.offscreen.createDocument({
        url,
        reasons,
        justification,
      });
    } catch (error) {
      logger.error('Failed to create offscreen document', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }

  /**
   * Close offscreen document.
   */
  public async closeOffscreenDocument(): Promise<void> {
    try {
      await chrome.offscreen.closeDocument();
    } catch (error) {
      logger.error('Failed to close offscreen document', {
        group: 'ChromeAPI',
        persist: true,
      });
      throw error;
    }
  }
}

export const chromeAPI = ChromeAPI.getInstance();
