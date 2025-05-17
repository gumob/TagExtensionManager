export const updateExtensionIcon = async (isDarkMode: boolean): Promise<void> => {
  const iconPath = isDarkMode ? '/icons/dark/' : '/icons/light/';
  
  try {
    await chrome.action.setIcon({
      path: {
        16: `${iconPath}icon16.png`,
        48: `${iconPath}icon48.png`,
        128: `${iconPath}icon128.png`
      }
    });
  } catch (error) {
    console.error('Failed to update extension icon:', error);
  }
};

export const initializeIconTheme = async (): Promise<void> => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.debug("[Extension Manager] isDarkMode: ${isDarkMode}");
  await updateExtensionIcon(isDarkMode);
}; 