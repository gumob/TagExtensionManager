import { updateExtensionIcon } from '@/utils/themeUtils';

/** Background script for extension management */
console.debug('[Extension Manager][background] Starting background script');

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
    console.debug('[Extension Manager][background] Offscreen document created successfully');
  } catch (error) {
    console.error('[Extension Manager][background] Failed to create offscreen document:', error);
  }
};

/**
 * Initialize icon based on system color scheme
 */
const initializeIcon = async () => {
  await createOffscreenDocument();
};

/**
 * Listen for extension installation
 */
chrome.runtime.onInstalled.addListener(async details => {
  console.debug('[Extension Manager][background] Extension installed', details);
  await initializeIcon();

  // Create Default profile only on fresh install
  if (details.reason === 'install') {
    console.debug('[Extension Manager][background] Creating Default profile');
    chrome.management.getAll(extensions => {
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
      chrome.storage.local.set({ 'extension-manager-profiles': defaultProfile }, () => {
        console.debug('[Extension Manager][background] Default profile saved to storage');
      });
    });
  }
});

/**
 * Listen for extension state changes
 */
chrome.management.onEnabled.addListener(extension => {
  console.debug(`[Extension Manager][background] Extension enabled: ${extension.name}`);
});

/**
 * Listen for extension disabled
 */
chrome.management.onDisabled.addListener(extension => {
  console.debug(`[Extension Manager][background] Extension disabled: ${extension.name}`);
});

/**
 * Listen for theme changes from offscreen document
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.debug('[Extension Manager][background] Received message:', message);
  if (message.type === 'COLOR_SCHEME_CHANGED') {
    console.debug(
      '[Extension Manager][background] Color scheme changed:',
      message.isDarkMode ? 'dark' : 'light'
    );
    updateExtensionIcon(message.isDarkMode);
    sendResponse({ success: true });
  } else if (message.type === 'CREATE_DEFAULT_PROFILE') {
    console.debug('[Extension Manager][background] Creating Default profile');
    chrome.management.getAll(extensions => {
      const defaultExtensions = extensions.map(ext => ({
        id: ext.id,
        enabled: ext.enabled,
      }));
      chrome.runtime.sendMessage({
        type: 'CREATE_DEFAULT_PROFILE',
        extensions: defaultExtensions,
      });
    });
    sendResponse({ success: true });
  }
  return true;
});
