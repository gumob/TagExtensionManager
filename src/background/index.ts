import { updateExtensionIcon } from '@/utils/themeUtils';

/** Background script for extension management */
console.debug('[SEM][background] Starting background script');

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
      justification: 'Detect system theme changes',
    });
    console.debug('[SEM][background] Offscreen document created successfully');
  } catch (error) {
    console.error('[SEM][background] Failed to create offscreen document:', error);
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
  console.debug('[SEM][background] Creating default profile');
  return new Promise<void>((resolve, reject) => {
    chrome.management.getAll(extensions => {
      console.debug('[SEM][background] Got extensions:', extensions);
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
      console.debug('[SEM][background] Setting default profile:', defaultProfile);
      chrome.storage.local.set({ 'extension-manager-profiles': defaultProfile }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            '[SEM][background] Error saving default profile:',
            chrome.runtime.lastError
          );
          reject(chrome.runtime.lastError);
        } else {
          console.debug('[SEM][background] Default profile saved to storage');
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
  console.debug('[SEM][background] Extension installed', details);
  await initializeIcon();

  try {
    /** Clear storage on first installation */
    if (details.reason === 'install') {
      console.debug('[SEM][background] Starting storage clear');
      await new Promise<void>((resolve, reject) => {
        chrome.storage.local.clear(() => {
          if (chrome.runtime.lastError) {
            console.error('[SEM][background] Error clearing storage:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.debug('[SEM][background] Storage cleared');
            resolve();
          }
        });
      });

      await createDefaultProfile();
    }
    console.debug('[SEM][background] Installation process completed');
  } catch (error) {
    console.error('[SEM][background] Error during installation:', error);
  }
});

/**
 * Listen for extension state changes
 */
chrome.management.onEnabled.addListener(extension => {
  console.debug(`[SEM][background] Extension enabled: ${extension.name}`);
});

/**
 * Listen for extension disabled
 */
chrome.management.onDisabled.addListener(extension => {
  console.debug(`[SEM][background] Extension disabled: ${extension.name}`);
});

/**
 * Listen for theme changes from offscreen document
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.debug('[SEM][background] Received message:', message);
  if (message.type === 'COLOR_SCHEME_CHANGED') {
    console.debug('[SEM][background] Color scheme changed:', message.isDarkMode ? 'dark' : 'light');
    updateExtensionIcon(message.isDarkMode);
    sendResponse({ success: true });
  }
  return true;
});
