import { chromeAPI } from '@/api/ChromeAPI';
import { logger } from '@/utils/Logger';
import { updateExtensionIcon } from '@/utils/ThemeUtils';

/** Background script for extension management */
logger.debug('🌱 Initializing background script', {
  group: 'background',
  persist: true,
});

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
      ['DOM_PARSER' as chrome.offscreen.Reason],
      'Detect system color scheme changes'
    );
    logger.debug('🌱 Offscreen document created successfully', {
      group: 'background',
      persist: true,
    });
  } catch (error) {
    logger.error('🛑 Failed to create offscreen document', {
      group: 'background',
      persist: true,
    });
  }
};

/**
 * Listen for extension installation
 */
chrome.runtime.onInstalled.addListener(async details => {
  logger.debug('🫱 Extension installed', {
    group: 'background',
    persist: true,
  });
  await createOffscreenDocument();
});

/**
 * Listen for extension state changes
 */
chrome.management.onEnabled.addListener(extension => {
  logger.debug(`🫱 Extension enabled: ${extension.name}`, {
    group: 'background',
    persist: true,
  });
});

/**
 * Listen for extension disabled
 */
chrome.management.onDisabled.addListener(extension => {
  logger.debug(`🫱 Extension disabled: ${extension.name}`, {
    group: 'background',
    persist: true,
  });
});

/**
 * Listen for theme changes from offscreen document
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.debug('🫱 Received message', {
    group: 'background',
    persist: true,
  });
  if (message.type === 'COLOR_SCHEME_CHANGED') {
    logger.debug('🫱 Color scheme changed', {
      group: 'background',
      persist: true,
    });
    updateExtensionIcon(message.isDarkMode);
    sendResponse({ success: true });
  }
  return true;
});
