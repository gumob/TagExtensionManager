import { logger } from '@/utils';

logger.debug('Initializing offscreen document');

/**
 * The function that sends the theme status to the background.
 */
const sendThemeStatus = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  logger.debug('isDarkMode', isDarkMode);
  try {
    chrome.runtime.sendMessage({ type: 'COLOR_SCHEME_CHANGED', isDarkMode }, response => {
      if (chrome.runtime.lastError) {
        logger.error('Failed to send theme status:', chrome.runtime.lastError);
        /** If there is a connection error, wait a little and try again */
        setTimeout(sendThemeStatus, 1000);
      } else {
        logger.debug('Theme status sent successfully');
      }
    });
  } catch (error) {
    logger.error('Failed to send theme status:', error);
    /** If there is an error, wait a little and try again */
    setTimeout(sendThemeStatus, 1000);
  }
};

/**
 * The function that sets the media query and logs the initial state.
 */
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
logger.debug('Initial media query state:', mediaQuery.matches);

/**
 * The function that sends the initial theme status.
 */
setTimeout(() => {
  logger.debug('Sending initial theme status');
  sendThemeStatus();
}, 2000);

/**
 * The function that listens for theme changes.
 */
const handleThemeChange = (event: MediaQueryListEvent) => {
  logger.debug('Theme change detected:', event.matches ? 'dark' : 'light');
  sendThemeStatus();
};

/**
 * Set the event listener and logs the initial state.
 */
try {
  mediaQuery.addEventListener('change', handleThemeChange);
  logger.debug('Theme change listener added successfully');
} catch (error) {
  logger.error('Failed to add theme change listener:', error);
}
