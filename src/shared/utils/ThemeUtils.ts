import React from 'react';

import { logger } from '@/shared/utils';

/**
 * Utility functions for dark mode detection and monitoring
 */

/**
 * Get the current dark mode state
 * @returns true if dark mode is active, false otherwise
 */
export const isDarkMode = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Theme detection for offscreen document
 */
export const detectThemeOnOffscreen = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  logger.debug('Theme detected', {
    group: 'themeDetector',
    persist: true,
  });
  chrome.runtime.sendMessage({
    type: 'COLOR_SCHEME_CHANGED',
    isDarkMode: isDarkMode,
  });
};

/**
 * Setup a color scheme listener
 * @param onChange - The callback function to be called when the color scheme changes
 * @returns A cleanup function
 */
export const setupColorSchemeListener = (onChange: (isDarkMode: boolean) => void) => {
  /** Notify the initial state */
  onChange(isDarkMode());

  /** Listen for color scheme changes */
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e: MediaQueryListEvent) => {
    onChange(e.matches);
  };

  mediaQuery.addEventListener('change', handleChange);

  /** Return a cleanup function */
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};

/**
 * Update extension icon based on color scheme
 * @param isDarkMode - Whether the color scheme is dark
 */
export const updateExtensionIcon = async (isDarkMode: boolean) => {
  logger.debug('Updating extension icon', {
    group: 'background',
    persist: true,
  });

  try {
    const iconPath = isDarkMode ? '/icons/dark/' : '/icons/light/';
    await chrome.action.setIcon({
      path: {
        16: `${iconPath}icon16.png`,
        48: `${iconPath}icon48.png`,
        128: `${iconPath}icon128.png`,
      },
    });
    logger.debug('Icon updated', {
      group: 'background',
      persist: true,
    });
  } catch (error) {
    logger.error('Failed to update extension icon', {
      group: 'background',
      persist: true,
    });
  }
};

/**
 * React custom hook for theme detection
 * @returns The current dark mode state
 */
export const useTheme = () => {
  const [isDark, setIsDark] = React.useState(isDarkMode());

  React.useEffect(() => {
    return setupColorSchemeListener(setIsDark);
  }, []);

  return isDark;
};
