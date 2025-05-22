import { Storage } from '@plasmohq/storage';

import { Message, MessageResponse } from '@/shared/types';

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
    const value = await this.storage.get<T>(key);
    return value ?? null;
  }

  /**
   * The set method.
   * @param key - The key.
   * @param value - The value.
   */
  public async set<T>(key: string, value: T): Promise<void> {
    await this.storage.set(key, value);
  }

  /**
   * The remove method.
   * @param key - The key.
   */
  public async remove(key: string): Promise<void> {
    await this.storage.remove(key);
  }

  /**
   * The clear method.
   */
  public async clear(): Promise<void> {
    await this.storage.clear();
  }

  // Tabs API
  /**
   * The get current tab method.
   * @returns The current tab.
   */
  public async getCurrentTab(): Promise<chrome.tabs.Tab | null> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab || null;
  }

  /**
   * The send message method.
   * @param tabId - The tab id.
   * @param message - The message.
   * @returns The message response.
   */
  public async sendMessage<T>(tabId: number, message: Message): Promise<MessageResponse<T>> {
    return await chrome.tabs.sendMessage(tabId, message);
  }

  // Runtime API
  /**
   * The send runtime message method.
   * @param message - The message.
   * @returns The message response.
   */
  public async sendRuntimeMessage<T>(message: Message): Promise<MessageResponse<T>> {
    return await chrome.runtime.sendMessage(message);
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
}

export const chromeAPI = ChromeAPI.getInstance();
