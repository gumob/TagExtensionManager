import { chromeAPI } from '@/api';
import { logger, updateExtensionIcon } from '@/utils';

/**
 * Background script
 */

/**
 * Create and manage offscreen document
 */
const createOffscreenDocument = async () => {
  try {
    /** Close existing document */
    if (await chromeAPI.hasOffscreenDocument()) {
      await chromeAPI.closeOffscreenDocument();
    }

    /** Create new document */
    await chromeAPI.createOffscreenDocument(
      'offscreen.html',
      ['MATCH_MEDIA' as chrome.offscreen.Reason],
      'Detect system color scheme changes'
    );
    logger.debug('🔙🌱 Offscreen document created successfully', {
      group: 'Background',
      persist: true,
    });
  } catch (error) {
    console.error('🔙🛑 Failed to initialize extensions', error);
  }
};

/**
 * Initialize background script
 */
const initialize = async () => {
  logger.debug('🔙🌱 Initializing background script', {
    group: 'Background',
    persist: true,
  });

  /**
   * Listen for theme changes from offscreen document
   */
  const handleColorSchemeChange = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    switch (message.type) {
      /**
       * Keep service worker active
       */
      case 'PING':
        logger.debug('🔙�� Received PING', {
          group: 'Background',
          persist: true,
        });
        sendResponse({ success: true });
        return true;
      /**
       * Theme detection from popup
       */
      case 'COLOR_SCHEME_CHANGED':
        logger.debug('🔙🫱 Color scheme changed', {
          group: 'Background',
          persist: true,
        });
        updateExtensionIcon(message.isDarkMode);
        sendResponse({ success: true });
        return true;
      /**
       * Debug messages
       */
      case 'OFFSCREEN_DEBUG':
        logger.debug(`🖥🐛 ${message.message}`, {
          group: 'Offscreen',
          persist: true,
        });
        sendResponse({ success: true });
        return true;
      /**
       * Error messages
       */
      case 'OFFSCREEN_ERROR':
        console.error(`🖥🔴 ${message.message}`, message.error);
        sendResponse({ success: true });
        return true;
      default:
        return false;
    }
  };

  /**
   * Remove existing listener and add new listener
   */
  chrome.runtime.onMessage.removeListener(handleColorSchemeChange);
  chrome.runtime.onMessage.addListener(handleColorSchemeChange);

  /**
   * Create offscreen document after listener is set
   */
  await createOffscreenDocument();
};

/**
 * Listen for extension installation
 */
chrome.runtime.onInstalled.addListener(async details => {
  logger.debug('🔙🫱 Extension installed', {
    group: 'Background',
    persist: true,
  });
  await initialize();
});

/**
 * Listen for extension startup
 */
chrome.runtime.onStartup.addListener(async () => {
  logger.debug('🔙🫱 Extension started', {
    group: 'Background',
    persist: true,
  });
  await initialize();
});
