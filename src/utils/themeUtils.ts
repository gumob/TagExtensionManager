import React from 'react';

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
  console.debug(
    '[Extension Manager][themeDetector] Theme detected:',
    isDarkMode ? 'dark' : 'light'
  );
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
  console.debug(
    '[Extension Manager][background] Updating extension icon to ',
    isDarkMode ? 'dark' : 'light'
  );
  const iconPath = isDarkMode ? '/icons/dark/' : '/icons/light/';
  try {
    await chrome.action.setIcon({
      path: {
        16: `${iconPath}icon16.png`,
        48: `${iconPath}icon48.png`,
        128: `${iconPath}icon128.png`,
      },
    });
    console.debug(
      `[Extension Manager][background] Icon updated to ${isDarkMode ? 'dark' : 'light'} mode`
    );
  } catch (error) {
    console.error('[Extension Manager][background] Failed to update extension icon:', error);
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
