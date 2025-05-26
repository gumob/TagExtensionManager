/**
 * Offscreen document
 */

/**
 * The function that logs to the background.
 *
 * @param {string} message
 */
const logToBackground = (message: string) => {
  try {
    chrome.runtime.sendMessage({ type: 'OFFSCREEN_DEBUG', message }, response => {
      if (chrome.runtime.lastError) {
        console.error('Failed to send log:', chrome.runtime.lastError);
      }
    });
  } catch (error) {
    console.error('Failed to send log:', error);
  }
};
const errorToBackground = (message: string, error: any) => {
  try {
    chrome.runtime.sendMessage({ type: 'OFFSCREEN_ERROR', message, error }, response => {
      if (chrome.runtime.lastError) {
        console.error('Failed to send error:', chrome.runtime.lastError);
      }
    });
  } catch (error) {
    console.error('Failed to send error:', error);
  }
};

logToBackground('Initializing offscreen document');

/**
 * The function that sends the theme status to the background.
 */
const sendThemeStatus = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  logToBackground(`isDarkMode: ${isDarkMode}`);
  try {
    chrome.runtime.sendMessage({ type: 'COLOR_SCHEME_CHANGED', isDarkMode }, response => {
      if (chrome.runtime.lastError) {
        errorToBackground('Failed to send theme status:', chrome.runtime.lastError);
        /** If there is a connection error, wait a little and try again */
        setTimeout(sendThemeStatus, 1000);
      } else {
        logToBackground('Theme status sent successfully');
      }
    });
  } catch (error) {
    errorToBackground('Failed to send theme status:', error);
    /** If there is an error, wait a little and try again */
    setTimeout(sendThemeStatus, 1000);
  }
};

/**
 * The function that sets the media query and logs the initial state.
 */
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
logToBackground(`Initial media query state: ${mediaQuery.matches}`);

/**
 * The function that sends the initial theme status.
 */
setTimeout(() => {
  logToBackground('Sending initial theme status');
  sendThemeStatus();
}, 2000);

/**
 * The function that listens for theme changes.
 */
const handleThemeChange = (event: MediaQueryListEvent) => {
  logToBackground(`Theme change detected: ${event.matches ? 'dark' : 'light'}`);
  sendThemeStatus();
};

/**
 * Set the event listener and logs the initial state.
 */
try {
  mediaQuery.addEventListener('change', handleThemeChange);
  logToBackground('Theme change listener added successfully');
} catch (error) {
  errorToBackground('Failed to add theme change listener:', error);
}
