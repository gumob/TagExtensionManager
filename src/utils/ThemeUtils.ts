import { chromeAPI } from '@/api';
import { logger } from '@/utils';

/**
 * Utility functions for dark mode detection and monitoring
 */

/**
 * Theme detection for offscreen document
 */
export const detectTheme = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  logger.debug('🧰🎨 Theme detected', {
    group: 'themeDetector',
    persist: true,
  });
  chromeAPI.sendRuntimeMessage({
    type: 'COLOR_SCHEME_CHANGED',
    isDarkMode: isDarkMode,
  });
};

/**
 * Update extension icon based on color scheme
 * @param isDarkMode - Whether the color scheme is dark
 */
export const updateExtensionIcon = async (isDarkMode: boolean) => {
  logger.debug('🧰🎨 Updating extension icon', {
    group: 'background',
    persist: true,
  });

  try {
    const iconPath = isDarkMode ? '/icons/dark/' : '/icons/light/';
    await chromeAPI.setIcon({
      path: {
        16: `${iconPath}icon16.png`,
        48: `${iconPath}icon48.png`,
        128: `${iconPath}icon128.png`,
      },
    });
    logger.debug('🧰🎨 Icon updated', {
      group: 'background',
      persist: true,
    });
  } catch (error) {
    console.error('🧰🛑 Failed to update extension icon', error);
  }
};
