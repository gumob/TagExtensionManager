import { logger } from '@/shared/utils/Logger';
import { updateExtensionIcon } from '@/shared/utils/ThemeUtils';

/** Background script for extension management */
logger.debug('Starting background script', {
  group: 'background',
  persist: true,
});

/**
 * Create and manage offscreen document
 */
const createOffscreenDocument = async () => {
  try {
    /** Close existing document */
    if (await chrome.offscreen.hasDocument()) {
      await chrome.offscreen.closeDocument();
    }

    /** Create new document */
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['DOM_PARSER' as chrome.offscreen.Reason],
      justification: 'Detect system color scheme changes',
    });
    logger.debug('Offscreen document created successfully', {
      group: 'background',
      persist: true,
    });
  } catch (error) {
    logger.error('Failed to create offscreen document', {
      group: 'background',
      persist: true,
    });
  }
};

/**
 * Initialize icon based on system color scheme
 */
const initializeIcon = async () => {
  await createOffscreenDocument();
};

/**
 * Create Default profile
 */
const createDefaultProfile = () => {
  logger.debug('Creating default profile', {
    group: 'background',
    persist: true,
  });
  return new Promise<void>((resolve, reject) => {
    chrome.management.getAll(extensions => {
      logger.debug('Got extensions', {
        group: 'background',
        persist: true,
      });
      const defaultExtensions = extensions.map(ext => ({
        id: ext.id,
        enabled: ext.enabled,
      }));
      const now = new Date().toISOString();
      const defaultProfile = {
        profiles: [
          {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            name: 'Default',
            extensions: defaultExtensions,
            createdAt: now,
            updatedAt: now,
          },
        ],
        currentProfileId: null,
      };
      logger.debug('Setting default profile', {
        group: 'background',
        persist: true,
      });
      chrome.storage.local.set({ 'extension-manager-profiles': defaultProfile }, () => {
        if (chrome.runtime.lastError) {
          logger.error('Error saving default profile', {
            group: 'background',
            persist: true,
          });
          reject(chrome.runtime.lastError);
        } else {
          logger.debug('Default profile saved to storage', {
            group: 'background',
            persist: true,
          });
          resolve();
        }
      });
    });
  });
};

/**
 * Listen for extension installation
 */
chrome.runtime.onInstalled.addListener(async details => {
  logger.debug('Extension installed', {
    group: 'background',
    persist: true,
  });
  await initializeIcon();

  try {
    /** Clear storage on first installation */
    if (details.reason === 'install') {
      logger.debug('Starting storage clear', {
        group: 'background',
        persist: true,
      });
      await new Promise<void>((resolve, reject) => {
        chrome.storage.local.clear(() => {
          if (chrome.runtime.lastError) {
            logger.error('Error clearing storage', {
              group: 'background',
              persist: true,
            });
            reject(chrome.runtime.lastError);
          } else {
            logger.debug('Storage cleared', {
              group: 'background',
              persist: true,
            });
            resolve();
          }
        });
      });

      await createDefaultProfile();
    }
    logger.debug('Installation process completed', {
      group: 'background',
      persist: true,
    });
  } catch (error) {
    logger.error('Error during installation', {
      group: 'background',
      persist: true,
    });
  }
});

/**
 * Listen for extension state changes
 */
chrome.management.onEnabled.addListener(extension => {
  logger.debug(`Extension enabled: ${extension.name}`, {
    group: 'background',
    persist: true,
  });
});

/**
 * Listen for extension disabled
 */
chrome.management.onDisabled.addListener(extension => {
  logger.debug(`Extension disabled: ${extension.name}`, {
    group: 'background',
    persist: true,
  });
});

/**
 * Listen for theme changes from offscreen document
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.debug('Received message', {
    group: 'background',
    persist: true,
  });
  if (message.type === 'COLOR_SCHEME_CHANGED') {
    logger.debug('Color scheme changed', {
      group: 'background',
      persist: true,
    });
    updateExtensionIcon(message.isDarkMode);
    sendResponse({ success: true });
  }
  return true;
});
