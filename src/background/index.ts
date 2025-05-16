// Background script for extension management
chrome.runtime.onInstalled.addListener(() => {
  console.debug('[Extension Manager] Extension Manager installed');
});
