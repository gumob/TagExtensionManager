// Background script for extension management
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Manager installed');
}); 